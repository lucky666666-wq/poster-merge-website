// 全局变量
let posterImage = null;
let logoImage = null;
let elementImage = null;
let mergedBlob = null;
let posterDimensions = { width: 0, height: 0 };

// DOM元素
const posterUpload = document.getElementById('posterUpload');
const logoUpload = document.getElementById('logoUpload');
const elementUpload = document.getElementById('elementUpload');
const posterInput = document.getElementById('posterInput');
const logoInput = document.getElementById('logoInput');
const elementInput = document.getElementById('elementInput');

const controlsSection = document.getElementById('controlsSection');
const loading = document.getElementById('loading');
const mergeBtn = document.getElementById('mergeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

const mergedInfo = document.getElementById('mergedInfo');
const previewContainer = document.querySelector('.preview-image-container');

const logoSize = document.getElementById('logoSize');
const logoSizeValue = document.getElementById('logoSizeValue');
const logoX = document.getElementById('logoX');
const logoY = document.getElementById('logoY');
const logoOpacity = document.getElementById('logoOpacity');
const logoOpacityValue = document.getElementById('logoOpacityValue');

const elementSize = document.getElementById('elementSize');
const elementSizeValue = document.getElementById('elementSizeValue');
const elementX = document.getElementById('elementX');
const elementY = document.getElementById('elementY');
const elementOpacity = document.getElementById('elementOpacity');
const elementOpacityValue = document.getElementById('elementOpacityValue');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateLogoSizeValue();
    updateLogoOpacityValue();
    updateElementSizeValue();
    updateElementOpacityValue();
    showPlaceholder();
    setDefaultPositions();
    
    // 添加欢迎提示
    showWelcomeMessage();
});

function setupEventListeners() {
    // 上传事件
    posterUpload.addEventListener('click', () => posterInput.click());
    logoUpload.addEventListener('click', () => logoInput.click());
    elementUpload.addEventListener('click', () => elementInput.click());
    posterInput.addEventListener('change', (e) => handleFileSelect(e, 'poster'));
    logoInput.addEventListener('change', (e) => handleFileSelect(e, 'logo'));
    elementInput.addEventListener('change', (e) => handleFileSelect(e, 'element'));

    // 拖拽功能
    setupDragAndDrop(posterUpload, posterInput, 'poster');
    setupDragAndDrop(logoUpload, logoInput, 'logo');
    setupDragAndDrop(elementUpload, elementInput, 'element');

    // Logo控制面板事件
    logoSize.addEventListener('input', updateLogoSizeValue);
    logoOpacity.addEventListener('input', updateLogoOpacityValue);
    logoSize.addEventListener('input', autoMerge);
    logoX.addEventListener('input', autoMerge);
    logoY.addEventListener('input', autoMerge);
    logoOpacity.addEventListener('input', autoMerge);

    // 装饰元素控制面板事件
    elementSize.addEventListener('input', updateElementSizeValue);
    elementOpacity.addEventListener('input', updateElementOpacityValue);
    elementSize.addEventListener('input', autoMerge);
    elementX.addEventListener('input', autoMerge);
    elementY.addEventListener('input', autoMerge);
    elementOpacity.addEventListener('input', autoMerge);

    // 按钮事件
    mergeBtn.addEventListener('click', mergeImages);
    downloadBtn.addEventListener('click', downloadImage);
    resetBtn.addEventListener('click', resetAll);
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
    // Ctrl/Cmd + Enter 合并
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!mergeBtn.disabled) {
            mergeImages();
        }
    }
    
    // Ctrl/Cmd + S 下载
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!downloadBtn.disabled) {
            downloadImage();
        }
    }
}

function setDefaultPositions() {
    // Logo默认位置：左上角
    logoX.value = 30;
    logoY.value = 30;
    
    // 装饰元素默认位置：右下角  
    elementX.value = 500; // 会在updatePositionLimits中重新计算
    elementY.value = 500; // 会在updatePositionLimits中重新计算
}

function showPlaceholder() {
    previewContainer.innerHTML = `
        <div class="preview-placeholder">
            <div style="font-size: 3em; margin-bottom: 15px;">🖼️</div>
            <div style="font-size: 1.2em; margin-bottom: 8px;">上传海报图片开始</div>
            <div>合并结果将在这里显示</div>
        </div>
    `;
    mergedInfo.textContent = '';
}

function showWelcomeMessage() {
    setTimeout(() => {
        if (!posterImage) {
            showNotification('欢迎使用海报Logo合并工具！🎉 先上传一张海报图片吧', 'info');
        }
    }, 1000);
}

function setupDragAndDrop(uploadArea, fileInput, type) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#764ba2';
        uploadArea.style.background = '#f0f2ff';
        uploadArea.style.transform = 'scale(1.02)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = 'white';
        uploadArea.style.transform = 'scale(1)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = 'white';
        uploadArea.style.transform = 'scale(1)';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0], type);
        }
    });
}

function handleFileSelect(e, type) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file, type);
    }
}

function handleFile(file, type) {
    if (!file.type.startsWith('image/')) {
        showNotification('请选择图片文件！支持 JPG、PNG、GIF 等格式', 'error');
        return;
    }
    
    // 检查文件大小 (限制为 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('图片文件太大，请选择小于 10MB 的图片', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            if (type === 'poster') {
                posterImage = img;
                posterUpload.classList.add('uploaded');
                posterDimensions = { width: img.width, height: img.height };
                updatePositionLimits();
                
                // 显示控制面板
                controlsSection.classList.add('active');
                
                // 添加成功提示
                showUploadSuccess(posterUpload);
                showNotification(`海报上传成功！尺寸: ${img.width} × ${img.height}`, 'success');
                
            } else if (type === 'logo') {
                logoImage = img;
                logoUpload.classList.add('uploaded');
                showUploadSuccess(logoUpload);
                showNotification('Logo上传成功！', 'success');
                
            } else if (type === 'element') {
                elementImage = img;
                elementUpload.classList.add('uploaded');
                showUploadSuccess(elementUpload);
                showNotification('装饰元素上传成功！', 'success');
                // 设置装饰元素默认位置为右下角
                setElementToBottomRight();
            }
            
            checkReadyToMerge();
        };
        img.onerror = () => {
            showNotification('图片加载失败，请尝试其他图片', 'error');
        };
        img.src = e.target.result;
    };
    reader.onerror = () => {
        showNotification('文件读取失败，请重试', 'error');
    };
    reader.readAsDataURL(file);
}

function showUploadSuccess(uploadCard) {
    // 动画效果
    uploadCard.style.transform = 'scale(1.05)';
    setTimeout(() => {
        uploadCard.style.transform = 'scale(1)';
    }, 200);
    
    const originalText = uploadCard.querySelector('.upload-text').textContent;
    uploadCard.querySelector('.upload-text').textContent = '✓ 成功';
    uploadCard.querySelector('.upload-hint').textContent = '已上传';
    
    setTimeout(() => {
        uploadCard.querySelector('.upload-text').textContent = originalText;
        uploadCard.querySelector('.upload-hint').textContent = uploadCard.id === 'posterUpload' ? '点击或拖拽上传' : '可选';
    }, 2000);
}

function checkReadyToMerge() {
    // 只要有海报就可以开始，Logo和元素都是可选的
    if (posterImage) {
        mergeBtn.disabled = false;
        autoMerge();
    }
}

function updateLogoSizeValue() {
    logoSizeValue.textContent = logoSize.value + '%';
}

function updateLogoOpacityValue() {
    logoOpacityValue.textContent = logoOpacity.value + '%';
}

function updateElementSizeValue() {
    elementSizeValue.textContent = elementSize.value + '%';
}

function updateElementOpacityValue() {
    elementOpacityValue.textContent = elementOpacity.value + '%';
}

function updatePositionLimits() {
    if (posterDimensions.width > 0) {
        logoX.max = posterDimensions.width;
        logoY.max = posterDimensions.height;
        elementX.max = posterDimensions.width;
        elementY.max = posterDimensions.height;
        
        // 如果有装饰元素，设置到右下角
        if (elementImage) {
            setElementToBottomRight();
        }
    }
}

function setElementToBottomRight() {
    if (!posterDimensions.width || !elementImage) return;
    
    const elementSizePercent = parseInt(elementSize.value);
    const elementWidth = (posterDimensions.width * elementSizePercent) / 100;
    const elementHeight = (elementWidth * elementImage.height) / elementImage.width;
    const x = posterDimensions.width - elementWidth - 30;
    const y = posterDimensions.height - elementHeight - 30;
    
    elementX.value = Math.max(0, Math.round(x));
    elementY.value = Math.max(0, Math.round(y));
    autoMerge();
}

function autoMerge() {
    if (posterImage && (logoImage || elementImage)) {
        setTimeout(() => mergeImages(), 100);
    }
}

function mergeImages() {
    if (!posterImage) {
        showNotification('请先上传海报图片', 'error');
        return;
    }
    
    loading.style.display = 'block';
    mergeBtn.disabled = true;
    
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布大小为海报大小
        canvas.width = posterImage.width;
        canvas.height = posterImage.height;
        
        // 绘制海报
        ctx.drawImage(posterImage, 0, 0);
        
        // 绘制Logo（如果存在）
        if (logoImage) {
            const logoSizePercent = parseInt(logoSize.value);
            const logoWidth = (posterImage.width * logoSizePercent) / 100;
            const logoHeight = (logoWidth * logoImage.height) / logoImage.width;
            const logoXPos = parseInt(logoX.value);
            const logoYPos = parseInt(logoY.value);
            
            // 设置Logo透明度
            const logoOpacityValue = parseInt(logoOpacity.value) / 100;
            ctx.globalAlpha = logoOpacityValue;
            
            // 绘制Logo
            ctx.drawImage(logoImage, logoXPos, logoYPos, logoWidth, logoHeight);
            ctx.globalAlpha = 1.0; // 重置透明度
        }
        
        // 绘制装饰元素（如果存在）
        if (elementImage) {
            const elementSizePercent = parseInt(elementSize.value);
            const elementWidth = (posterImage.width * elementSizePercent) / 100;
            const elementHeight = (elementWidth * elementImage.height) / elementImage.width;
            const elementXPos = parseInt(elementX.value);
            const elementYPos = parseInt(elementY.value);
            
            // 设置元素透明度
            const elementOpacityValue = parseInt(elementOpacity.value) / 100;
            ctx.globalAlpha = elementOpacityValue;
            
            // 绘制装饰元素
            ctx.drawImage(elementImage, elementXPos, elementYPos, elementWidth, elementHeight);
            ctx.globalAlpha = 1.0; // 重置透明度
        }
        
        // 转换为blob
        canvas.toBlob((blob) => {
            mergedBlob = blob;
            
            // 显示合并结果
            const mergedUrl = URL.createObjectURL(blob);
            previewContainer.innerHTML = `<img class="preview-image-large" src="${mergedUrl}" alt="合并预览">`;
            
            const fileSize = formatFileSize(blob.size);
            mergedInfo.innerHTML = `
                <strong>合并完成！</strong><br>
                尺寸: ${canvas.width} × ${canvas.height} 像素<br>
                文件大小: ${fileSize}
            `;
            
            downloadBtn.disabled = false;
            mergeBtn.disabled = false;
            loading.style.display = 'none';
            
            // 添加合并成功的视觉反馈
            previewContainer.classList.add('preview-success');
            setTimeout(() => {
                previewContainer.classList.remove('preview-success');
            }, 2000);
            
            showNotification('图片合并成功！可以下载了 🎉', 'success');
            
        }, 'image/jpeg', 0.95);
        
    } catch (error) {
        console.error('合并失败:', error);
        showNotification('图片合并失败，请重试', 'error');
        loading.style.display = 'none';
        mergeBtn.disabled = false;
    }
}

function downloadImage() {
    if (!mergedBlob) {
        showNotification('请先合并图片', 'error');
        return;
    }
    
    try {
        const url = URL.createObjectURL(mergedBlob);
        const a = document.createElement('a');
        a.href = url;
        
        // 生成带时间戳的文件名
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        a.download = `poster_merged_${timestamp}.jpg`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // 下载成功提示
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = '✓ 下载成功';
        downloadBtn.style.background = '#28a745';
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.style.background = '';
        }, 2000);
        
        showNotification('下载成功！文件已保存到您的下载文件夹', 'success');
        
    } catch (error) {
        console.error('下载失败:', error);
        showNotification('下载失败，请重试', 'error');
    }
}

function resetAll() {
    // 确认重置
    if (posterImage || logoImage || elementImage) {
        if (!confirm('确定要重置所有内容吗？')) {
            return;
        }
    }
    
    posterImage = null;
    logoImage = null;
    elementImage = null;
    mergedBlob = null;
    posterDimensions = { width: 0, height: 0 };
    
    posterInput.value = '';
    logoInput.value = '';
    elementInput.value = '';
    posterUpload.classList.remove('uploaded');
    logoUpload.classList.remove('uploaded');
    elementUpload.classList.remove('uploaded');
    
    // 重置上传卡片文本
    posterUpload.querySelector('.upload-text').textContent = '海报图片';
    posterUpload.querySelector('.upload-hint').textContent = '点击或拖拽上传';
    logoUpload.querySelector('.upload-text').textContent = 'Logo图片';
    logoUpload.querySelector('.upload-hint').textContent = '可选';
    elementUpload.querySelector('.upload-text').textContent = '装饰元素';
    elementUpload.querySelector('.upload-hint').textContent = '可选';
    
    // 隐藏控制面板
    controlsSection.classList.remove('active');
    
    loading.style.display = 'none';
    
    mergeBtn.disabled = true;
    downloadBtn.disabled = true;
    
    // 重置Logo控制值
    logoSize.value = 18;
    logoOpacity.value = 100;
    updateLogoSizeValue();
    updateLogoOpacityValue();
    
    // 重置装饰元素控制值
    elementSize.value = 15;
    elementOpacity.value = 90;
    updateElementSizeValue();
    updateElementOpacityValue();
    
    // 重置默认位置
    setDefaultPositions();
    
    // 显示占位符
    showPlaceholder();
    
    showNotification('已重置所有内容', 'info');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// 通知系统
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // 滑入动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动消失
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, type === 'error' ? 5000 : 3000);
}

// 关于对话框
function showAbout() {
    const aboutText = `
🎨 海报Logo合并工具

这是一个完全免费的在线工具，帮助您轻松为海报添加Logo和装饰元素。

✨ 主要特性：
• 支持 JPG、PNG、GIF 等常见图片格式
• 精确的位置和大小控制
• 透明度调节功能
• 实时预览效果
• 高质量图片输出
• 完全本地处理，保护您的隐私

🎯 使用方法：
1. 上传海报图片（必需）
2. 可选择上传Logo或装饰元素
3. 调整位置、大小和透明度
4. 实时查看合并效果
5. 点击下载保存结果

⌨️ 快捷键：
• Ctrl/Cmd + Enter: 合并图片
• Ctrl/Cmd + S: 下载结果

💡 温馨提示：
所有图片处理都在您的浏览器中完成，我们不会收集或存储任何图片数据。

🎉 希望这个工具对您有帮助！
    `;
    
    alert(aboutText);
}

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停自动合并
        console.log('页面隐藏，暂停处理');
    } else {
        // 页面显示时恢复
        console.log('页面显示，恢复处理');
        if (posterImage && (logoImage || elementImage)) {
            autoMerge();
        }
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('发生错误:', e.error);
    showNotification('发生了意外错误，请刷新页面重试', 'error');
});

// 网络状态检测
window.addEventListener('online', function() {
    showNotification('网络已连接', 'success');
});

window.addEventListener('offline', function() {
    showNotification('网络已断开，但工具仍可正常使用', 'info');
}); 