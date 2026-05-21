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
        startSmartAnalysis(); // بدء التحليل فور رفع الصورة
    };

    reader.readAsDataURL(file);
}

// 3. دالة محاكاة التحليل باستخدام الوعود غير المتزامنة (Async/Await)
async function startSmartAnalysis() {
    // إخفاء النتائج السابقة إن وجدت
    resultsBox.style.display = 'none';
    barsContainer.innerHTML = '';
    
    // تشغيل الرادار ومؤشر التحميل
    uploadArea.style.pointerEvents = 'none'; // منع ضغط المستخدم أثناء التحليل
    cyberScanner.style.display = 'block';
    loadingSpinner.style.display = 'block';

    // محاكاة مراحل المعالجة بخطوات زمنية متعاقبة
    statusText.style.color = 'var(--text-main)';
    statusText.innerText = "جاري تهيئة الشبكة العصبية...";
    await delay(1200);

    statusText.innerText = "تحديد المعالم الهيكلية للوجه...";
    await delay(1500);

    statusText.innerText = "مقارنة البيانات مع السجلات الجينية العالمية...";
    await delay(1800);

    statusText.innerText = "توليد الخريطة العرقية النهائية...";
    await delay(1000);

    // إنهاء التحليل وعرض النتائج
    cyberScanner.style.display = 'none';
    loadingSpinner.style.display = 'none';
    statusText.style.color = '#10b981'; // لون أخضر للنجاح
    statusText.innerText = "اكتمل التحليل بنجاح!";
    
    generateAndDisplayResults();
}

// دالة مساعدة لتأخير التنفيذ (تستخدم مع await)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 4. توليد نتائج ديناميكية ومتحركة
function generateAndDisplayResults() {
    // قاعدة بيانات وهمية للنتائج
    const databases = [
        [{ name: "شمال أفريقيا", pct: 68 }, { name: "الشرق الأوسط", pct: 22 }, { name: "أوروبا الجنوبية", pct: 10 }],
        [{ name: "بلاد الشام والرافدين", pct: 55 }, { name: "آسيا الوسطى", pct: 30 }, { name: "أصول أخرى", pct: 15 }],
        [{ name: "شبه الجزيرة العربية", pct: 70 }, { name: "القرن الأفريقي", pct: 20 }, { name: "شرق آسيا", pct: 10 }]
    ];

    const finalResult = databases[Math.floor(Math.random() * databases.length)];

    finalResult.forEach((item, index) => {
        // إنشاء عناصر HTML لكل نتيجة عبر الجافا سكريبت
        const barWrapper = document.createElement('div');
        barWrapper.className = 'bar-wrapper';
        
        barWrapper.innerHTML = `
            <div class="bar-info">
                <span>${item.name}</span>
                <span id="counter-${index}">0%</span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" id="fill-${index}"></div>
            </div>
        `;
        barsContainer.appendChild(barWrapper);

        // تشغيل تأثير تعبئة الشريط بعد إضافته بلحظات
        setTimeout(() => {
            document.getElementById(`fill-${index}`).style.width = `${item.pct}%`;
            animateValue(`counter-${index}`, 0, item.pct, 1500);
        }, 100 * index); // تأخير متسلسل لكل شريط
    });

    resultsBox.style.display = 'block';
}

// 5. أنيميشن تصاعد الأرقام (عداد النسب المئوية)
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
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
    uploadArea.style.pointerEvents = 'auto'; // إعادة تفعيل الرفع
});

