// 主要JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initTerminalAnimation();
    initParticles();
    initSmoothScrolling();
    initCopyToClipboard();
    initVideoPlaceholder();
    initStatsCounter();
    initTypewriterEffect();
});

// 导航栏功能
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    // 移动端菜单切换
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 点击导航链接关闭移动端菜单
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.scroll-animate, .feature-card, .download-card, .community-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// 终端动画
function initTerminalAnimation() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    let delay = 0;

    terminalLines.forEach((line, index) => {
        if (index < terminalLines.length - 1) { // 除了最后一行（光标）
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, delay);
            delay += 500;
        }
    });

    // 光标闪烁
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
}

// 粒子效果
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置和大小
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const delay = Math.random() * 6;
    
    particle.style.cssText = `
        left: ${x}px;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.5 + 0.2};
    `;
    
    container.appendChild(particle);
    
    // 动画结束后重新创建粒子
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 6000 + delay * 1000);
}

// 平滑滚动
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 复制到剪贴板
function initCopyToClipboard() {
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const commandBox = this.parentElement;
            const code = commandBox.querySelector('code');
            
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    // 显示成功提示
                    showNotification('命令已复制到剪贴板！', 'success');
                    
                    // 按钮动画
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                }).catch(() => {
                    showNotification('复制失败，请手动复制', 'error');
                });
            }
        });
    }
}

// 显示安装命令
function showInstallCommand() {
    const installCommand = document.getElementById('installCommand');
    if (installCommand) {
        installCommand.style.display = 'block';
        installCommand.scrollIntoView({ behavior: 'smooth' });
    }
}

// 视频占位符
function initVideoPlaceholder() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // 检查是否已经有视频在播放
            const existingVideo = videoPlaceholder.querySelector('video');
            if (existingVideo) {
                existingVideo.remove();
                videoPlaceholder.classList.remove('playing');
                return;
            }

            // 创建视频元素
            const video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.preload = 'metadata';
            
            // 设置视频源（尝试多个可能的路径）
            const videoPaths = [
                './video/HadoopDeploy_tool.mp4',
                '../video/HadoopDeploy_tool.mp4',
                './HadoopDeploy_Promotion/video/HadoopDeploy_tool.mp4'
            ];
            
            let currentPathIndex = 0;
            
            function tryNextPath() {
                if (currentPathIndex < videoPaths.length) {
                    video.src = videoPaths[currentPathIndex];
                    currentPathIndex++;
                } else {
                    // 所有路径都失败
                    showNotification('视频文件未找到，请检查文件路径', 'error');
                    video.remove();
                    videoPlaceholder.classList.remove('playing');
                }
            }
            
            // 视频加载错误处理
            video.addEventListener('error', function() {
                console.error('视频加载失败:', video.src);
                tryNextPath();
            });
            
            // 视频加载成功
            video.addEventListener('loadeddata', function() {
                console.log('视频加载成功:', video.src);
                videoPlaceholder.classList.add('playing');
            });
            
            // 视频播放结束
            video.addEventListener('ended', function() {
                showNotification('视频播放完成', 'info');
                videoPlaceholder.classList.remove('playing');
            });
            
            // 视频播放
            video.addEventListener('play', function() {
                videoPlaceholder.classList.add('playing');
            });
            
            // 添加到占位符中
            videoPlaceholder.appendChild(video);
            
            // 尝试第一个路径
            tryNextPath();
        });
    }
}

// 数字计数器动画
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                if (finalValue.includes('%')) {
                    animatePercentage(target, finalValue);
                } else if (finalValue.includes('分钟')) {
                    animateTime(target, finalValue);
                } else {
                    animateNumber(target, finalValue);
                }
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, finalValue) {
    const number = parseInt(finalValue);
    let current = 0;
    const increment = number / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 50);
}

function animatePercentage(element, finalValue) {
    const number = parseInt(finalValue);
    let current = 0;
    const increment = number / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 50);
}

function animateTime(element, finalValue) {
    const number = parseInt(finalValue);
    let current = 0;
    const increment = number / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '分钟';
    }, 50);
}

// 打字机效果
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    });
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 关闭按钮
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 自动关闭
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// 性能优化
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 窗口大小改变时重新调整
window.addEventListener('resize', debounce(() => {
    // 重新初始化粒子
    const particlesContainer = document.querySelector('.particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        initParticles();
    }
}, 250));

// 页面可见性API
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        document.body.style.setProperty('animation-play-state', 'paused');
    } else {
        // 页面显示时恢复动画
        document.body.style.setProperty('animation-play-state', 'running');
    }
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 聚焦搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // 这里可以添加搜索功能
        showNotification('搜索功能即将上线！', 'info');
    }
    
    // ESC 关闭通知
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
});

// 预加载关键资源
function preloadCriticalResources() {
    const criticalImages = [
        // 添加需要预加载的图片
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

// 页面加载完成后的优化
window.addEventListener('load', () => {
    // 移除加载动画
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
    
    // 预加载非关键资源
    preloadCriticalResources();
    
    // 初始化懒加载
    initLazyLoading();
});

// 懒加载
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
} 