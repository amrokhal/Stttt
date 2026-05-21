// تحديد عناصر واجهة المستخدم
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadContent = document.getElementById('uploadContent');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const cyberScanner = document.getElementById('cyberScanner');
const statusText = document.getElementById('statusText');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsBox = document.getElementById('resultsBox');
const barsContainer = document.getElementById('barsContainer');
const resetBtn = document.getElementById('resetBtn');

// إعدادات الـ API (مثال باستخدام نموذج تصنيف من Hugging Face)
// ملاحظة: للاستخدام المكثف يفضل الحصول على Free API Token من موقعهم وضعه هنا لتجنب قيود الطلبات
const HF_API_URL = "https://api-inference.huggingface.co/models/Dima74/ethnicity_classification_v2"; 

// 1. تفعيل ميزة السحب والإفلات (Drag & Drop)
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleImageUpload();
    }
});

fileInput.addEventListener('change', handleImageUpload);

// 2. معالجة وعرض الصورة المرفوعة
function handleImageUpload() {
    if (!fileInput.files[0]) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadContent.style.display = 'none';
        previewContainer.style.display = 'block';
        analyzeImageWithAI(file); // استدعاء الدالة الحقيقية وإرسال ملف الصورة
    };

    reader.readAsDataURL(file);
}

// 3. الدالة الحقيقية للاتصال بالذكاء الاصطناعي (Async/Await Fetch)
async function analyzeImageWithAI(fileBlob) {
    // إخفاء النتائج السابقة وتشغيل أنيميشن الفحص
    resultsBox.style.display = 'none';
    barsContainer.innerHTML = '';
    uploadArea.style.pointerEvents = 'none'; 
    cyberScanner.style.display = 'block';
    loadingSpinner.style.display = 'block';

    statusText.style.color = 'var(--text-main)';
    statusText.innerText = "جاري قراءة البيانات الثنائية للصورة...";

    try {
        statusText.innerText = "جاري إرسال الصورة إلى خادم الذكاء الاصطناعي...";
        
        // إرسال طلب الـ API الحقيقي
        const response = await fetch(HF_API_URL, {
            method: "POST",
            body: fileBlob,
        });

        if (!response.ok) {
            throw new Error("فشل الخادم في معالجة الصورة أو أن النموذج جاري تحميله الآن.");
        }

        statusText.innerText = "جاري تحليل الملامح واستخراج النسب المئوية...";
        const data = await response.json();

        // إيقاف أنيميشن التحميل
        cyberScanner.style.display = 'none';
        loadingSpinner.style.display = 'none';
        statusText.style.color = '#10b981'; 
        statusText.innerText = "اكتمل التحليل الحقيقي بنجاح!";

        displayRealResults(data);

    } catch (error) {
        // التعامل مع الأخطاء في حال انقطاع الإنترنت أو مشاكل السيرفر
        cyberScanner.style.display = 'none';
        loadingSpinner.style.display = 'none';
        statusText.style.color = '#ef4444';
        statusText.innerText = `عذراً، حدث خطأ: ${error.message}`;
        uploadArea.style.pointerEvents = 'auto';
    }
}

// 4. عرض النتائج الحقيقية القادمة من الـ API وتفعيل الأنيميشن
function displayRealResults(aiData) {
    // النماذج عادة تعيد مصفوفة تحتوي على الـ label (الاسم العرقي) والـ score (النسبة من 0 إلى 1)
    // نقوم بترتيبها من الأعلى نسبة إلى الأقل
    const sortedResults = aiData.sort((a, b) => b.score - a.score);

    sortedResults.forEach((item, index) => {
        const percentage = Math.round(item.score * 100); // تحويل الكسر إلى نسبة مئوية (مثلاً 0.75 تصبح 75%)
        
        // ترجمة أسماء الأعراق الشائعة القادمة من النموذج الإنجليزي إلى العربية (اختياري تحسينياً)
        let arabicName = item.label;
        if(item.label.toLowerCase().includes('african')) arabicName = "أصول أفريقية";
        else if(item.label.toLowerCase().includes('asian')) arabicName = "أصول آسيوية";
        else if(item.label.toLowerCase().includes('caucasian') || item.label.toLowerCase().includes('white')) arabicName = "أصول قوقازية / أوروبية";
        else if(item.label.toLowerCase().includes('middle eastern')) arabicName = "أصول من الشرق الأوسط";

        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';
        
        barWrapper.innerHTML = `
            <div class="bar-info">
                <span>${arabicName}</span>
                <span id="counter-${index}">0%</span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" id="fill-${index}"></div>
            </div>
        `;
        barsContainer.appendChild(barWrapper);

        // تشغيل العدادات التجميلية بناءً على الأرقام الحقيقية القادمة من السيرفر
        setTimeout(() => {
            document.getElementById(`fill-${index}`).style.width = `${percentage}%`;
            animateValue(`counter-${index}`, 0, percentage, 1200);
        }, 100 * index);
    });

    resultsBox.style.display = 'block';
}

// 5. عداد تصاعد الأرقام الفاخر
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + "%";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 6. إعادة تعيين الموقع لفحص صورة جديدة
resetBtn.addEventListener('click', () => {
    fileInput.value = "";
    previewContainer.style.display = 'none';
    uploadContent.style.display = 'block';
    resultsBox.style.display = 'none';
    statusText.style.color = 'var(--text-muted)';
    statusText.innerText = "في انتظار الصورة...";
    uploadArea.style.pointerEvents = 'auto';
});
