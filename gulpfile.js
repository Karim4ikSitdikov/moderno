 const {src, dest, watch, parallel, series} = require('gulp');  // База  // parallel для паралельного запуска разных функций // series для последовательности действий

 const scss = require('gulp-sass')(require('sass'));  // Из SCSS в CSS
 const concat = require('gulp-concat'); // Объединение файлов
 const uglify = require('gulp-uglify-es').default; // Сжатие/улучшение файлов
 const browserSync = require('browser-sync').create(); // Автообновление браузера
 const autoprefixer = require('gulp-autoprefixer'); // Изменение файлов для поддержки разными браузерами
 const clean = require('gulp-clean'); // Очистка папок
 const newer = require('gulp-newer');


 // Минимизация скриптов (JS)
 function scripts(){
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream()); // Обновление сайта после выполнения функции
 }


// Из SCSS в CSS (препроцессор)
 function styles(){
    return src('app/scss/style.scss')
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(concat('style.min.css'))  // Минификация файла
        .pipe(scss({outputStyle: 'compressed'}))  // Откуда
        .pipe(dest('app/css')) //Куда
        .pipe(browserSync.stream()); // Обновление сайта после выполнения функции
 }


 // Следит за изменениями проекта и сохраняет их
 function watching(){
    watch(['app/scss/style.scss'], styles) // Если в файле style.scss происходят изменения, запускает функцию styles
    watch(['app/images/src'], images)
    watch(['app/js/main.js'], scripts)
    watch(['app/**/*.html']).on('change', browserSync.reload) 
 }


 // Автообновление сайта при изменении файлов
 function browsersync(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
 }


// Очистка папки Dist перед обновлением файлов
 function cleanDist() {
    return src('dist')
        .pipe(clean())
 }


// Перенос черновых файлов в беловые для загрузки на хостинг
 function building(){
    return src([
        'app/css/style.min.css',
        'app/images/dist/*.*',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'}) // Сохранить базовую структуру файлов
        .pipe(dest('dist')) // Куда кидать это все
 }


// Экспорт всего
 exports.styles = styles;
 exports.scripts = scripts;
 exports.watching = watching;
 exports.browsersync = browsersync;
 exports.images = images;
 exports.fonts = fonts;

 exports.build = series(cleanDist, building);  // Очистка и добавление новых файлов в чистову папку
 exports.default = parallel(styles, images, scripts, browsersync, watching); // паралельно и в правильной последовательности запускаем функции (gulp для запуска)