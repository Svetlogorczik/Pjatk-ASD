/* Interface strings (not lecture content) in three languages + helpers. */
(function (ASD) {
  'use strict';

  var STRINGS = {
    pl: {
      siteTitle: 'Algorytmy i struktury danych',
      skip: 'Przejdź do treści',
      menu: 'Menu',
      theme: 'Zmień motyw (jasny / ciemny)',
      close: 'Zamknij',
      print: 'Drukuj',
      loading: 'Ładowanie…',
      loadError: 'Nie udało się wczytać treści. Uruchom „node tools/build.js” i odśwież stronę.',
      notFound: 'Nie ma takiej strony.',
      backHome: 'Wróć na stronę główną',

      navTopics: 'Tematy',
      navInfo: 'Informacje',
      progress: 'Postęp: {done} z {all}',

      lecture: 'Wykład',
      topicLabel: 'Temat {n}',
      summaryBtn: 'Konspekt',
      summaryTitle: 'Konspekt — {title}',
      summaryNone: 'Konspekt dla tego tematu jeszcze nie powstał.',
      exercisesBtn: 'Ćwiczenia',
      exercisesHeading: 'Ćwiczenia do tematu',
      exercisesIntro: 'Zadania mają tę samą logikę co zadania z zajęć, ale inne dane i treść. Najpierw spróbuj sam(a), dopiero potem otwórz podpowiedź lub rozwiązanie.',
      sources: 'Na podstawie wykładów',
      exerciseSources: 'Logika zadań z ćwiczeń',
      markDone: 'Oznacz jako przerobione',
      done: 'Przerobione',
      prev: 'Poprzedni temat',
      next: 'Następny temat',
      onThisPage: 'Na tej stronie',
      toTop: 'Do góry',
      readingTime: '~{min} min czytania',

      task: 'Zadanie',
      hint: 'Podpowiedź',
      solution: 'Rozwiązanie',
      level1: 'łatwe',
      level2: 'średnie',
      level3: 'trudne',
      taskAdapted: 'na podstawie',
      taskOwn: 'zadanie od autora strony',

      pseudocode: 'Pseudokod',
      copy: 'Kopiuj',
      copied: 'Skopiowano!',
      copyFail: 'Nie udało się skopiować — zaznacz kod ręcznie.',

      calloutOwn: 'Od autora strony — tego nie ma w wykładach',
      calloutAnalogy: 'Prosta analogia (od autora strony)',
      calloutTip: 'Wskazówka',
      calloutWarn: 'Uwaga — częsty błąd',
      calloutInfo: 'Dobrze wiedzieć',
      calloutExam: 'Ważne na ćwiczeniach i testach',
      calloutDef: 'Definicja',
      calloutExample: 'Przykład',
      calloutFormula: 'Wzór',
      calloutAnswer: 'Odpowiedź',
      calloutOwnShort: 'Od autora',
      calloutAnalogyShort: 'Analogia',
      calloutTipShort: 'Wskazówka',
      calloutWarnShort: 'Uwaga',
      calloutInfoShort: 'Info',
      calloutExamShort: 'Na sprawdzian',
      calloutDefShort: 'Definicja',
      calloutExampleShort: 'Przykład',
      calloutFormulaShort: 'Wzór',
      calloutAnswerShort: 'Odpowiedź',
      badgeOwn: 'od autora'
    },

    en: {
      siteTitle: 'Algorithms and Data Structures',
      skip: 'Skip to content',
      menu: 'Menu',
      theme: 'Toggle theme (light / dark)',
      close: 'Close',
      print: 'Print',
      loading: 'Loading…',
      loadError: 'Could not load the content. Run "node tools/build.js" and reload the page.',
      notFound: 'This page does not exist.',
      backHome: 'Back to the home page',

      navTopics: 'Topics',
      navInfo: 'Information',
      progress: 'Progress: {done} of {all}',

      lecture: 'Lecture',
      topicLabel: 'Topic {n}',
      summaryBtn: 'Summary',
      summaryTitle: 'Summary — {title}',
      summaryNone: 'There are no short notes for this topic yet.',
      exercisesBtn: 'Exercises',
      exercisesHeading: 'Exercises for this topic',
      exercisesIntro: 'The tasks follow the same logic as the class exercises, but with different data and wording. Try on your own first, then open the hint or the solution.',
      sources: 'Based on lectures',
      exerciseSources: 'Task logic from classes',
      markDone: 'Mark as done',
      done: 'Done',
      prev: 'Previous topic',
      next: 'Next topic',
      onThisPage: 'On this page',
      toTop: 'Back to top',
      readingTime: '~{min} min read',

      task: 'Task',
      hint: 'Hint',
      solution: 'Solution',
      level1: 'easy',
      level2: 'medium',
      level3: 'hard',
      taskAdapted: 'based on',
      taskOwn: 'task by the site author',

      pseudocode: 'Pseudocode',
      copy: 'Copy',
      copied: 'Copied!',
      copyFail: 'Copy failed — please select the code manually.',

      calloutOwn: 'From the site author — not in the lectures',
      calloutAnalogy: 'Simple analogy (by the site author)',
      calloutTip: 'Tip',
      calloutWarn: 'Watch out — common mistake',
      calloutInfo: 'Good to know',
      calloutExam: 'Important for classes and tests',
      calloutDef: 'Definition',
      calloutExample: 'Example',
      calloutFormula: 'Formula',
      calloutAnswer: 'Answer',
      calloutOwnShort: 'By the author',
      calloutAnalogyShort: 'Analogy',
      calloutTipShort: 'Tip',
      calloutWarnShort: 'Watch out',
      calloutInfoShort: 'Info',
      calloutExamShort: 'For the test',
      calloutDefShort: 'Definition',
      calloutExampleShort: 'Example',
      calloutFormulaShort: 'Formula',
      calloutAnswerShort: 'Answer',
      badgeOwn: 'by the author'
    },

    ru: {
      siteTitle: 'Алгоритмы и структуры данных',
      skip: 'Перейти к содержимому',
      menu: 'Меню',
      theme: 'Сменить тему (светлая / тёмная)',
      close: 'Закрыть',
      print: 'Печать',
      loading: 'Загрузка…',
      loadError: 'Не удалось загрузить материалы. Запустите «node tools/build.js» и обновите страницу.',
      notFound: 'Такой страницы нет.',
      backHome: 'Вернуться на главную',

      navTopics: 'Темы',
      navInfo: 'Информация',
      progress: 'Прогресс: {done} из {all}',

      lecture: 'Лекция',
      topicLabel: 'Тема {n}',
      summaryBtn: 'Конспект',
      summaryTitle: 'Конспект — {title}',
      summaryNone: 'Конспекта для этой темы пока нет.',
      exercisesBtn: 'Упражнения',
      exercisesHeading: 'Упражнения по теме',
      exercisesIntro: 'Логика задач та же, что на занятиях (ćwiczenia), но данные и формулировки другие. Сначала попробуйте сами, потом открывайте подсказку или решение.',
      sources: 'По материалам лекций',
      exerciseSources: 'Логика задач с занятий',
      markDone: 'Отметить как пройденное',
      done: 'Пройдено',
      prev: 'Предыдущая тема',
      next: 'Следующая тема',
      onThisPage: 'На этой странице',
      toTop: 'Наверх',
      readingTime: '~{min} мин чтения',

      task: 'Задача',
      hint: 'Подсказка',
      solution: 'Решение',
      level1: 'лёгкая',
      level2: 'средняя',
      level3: 'сложная',
      taskAdapted: 'по мотивам',
      taskOwn: 'задача от автора сайта',

      pseudocode: 'Псевдокод',
      copy: 'Копировать',
      copied: 'Скопировано!',
      copyFail: 'Не удалось скопировать — выделите код вручную.',

      calloutOwn: 'От автора сайта — этого нет в лекциях',
      calloutAnalogy: 'Простая аналогия (от автора сайта)',
      calloutTip: 'Подсказка',
      calloutWarn: 'Внимание — частая ошибка',
      calloutInfo: 'Полезно знать',
      calloutExam: 'Важно для занятий и тестов',
      calloutDef: 'Определение',
      calloutExample: 'Пример',
      calloutFormula: 'Формула',
      calloutAnswer: 'Ответ',
      calloutOwnShort: 'От автора',
      calloutAnalogyShort: 'Аналогия',
      calloutTipShort: 'Подсказка',
      calloutWarnShort: 'Внимание',
      calloutInfoShort: 'Инфо',
      calloutExamShort: 'Для теста',
      calloutDefShort: 'Определение',
      calloutExampleShort: 'Пример',
      calloutFormulaShort: 'Формула',
      calloutAnswerShort: 'Ответ',
      badgeOwn: 'от автора'
    }
  };

  var LANGS = ['pl', 'en', 'ru'];

  function detect() {
    var saved = ASD.storage.get('lang', null);
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || 'pl').slice(0, 2).toLowerCase();
    if (nav === 'ru' || nav === 'uk' || nav === 'be') return 'ru';
    if (nav === 'en') return 'en';
    return 'pl';
  }

  ASD.i18n = {
    langs: LANGS,
    lang: detect(),

    isLang: function (l) { return LANGS.indexOf(l) >= 0; },

    t: function (key, vars) {
      var s = (STRINGS[this.lang] && STRINGS[this.lang][key]) || STRINGS.pl[key] || key;
      if (vars) {
        Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
      }
      return s;
    },

    set: function (lang) {
      if (!this.isLang(lang)) return;
      this.lang = lang;
      ASD.storage.set('lang', lang);
      document.documentElement.setAttribute('lang', lang);
      this.apply(document);
    },

    /* Fills static markup marked with data-i18n / data-i18n-title. */
    apply: function (root) {
      var self = this;
      ASD.util.qsa('[data-i18n]', root).forEach(function (n) { n.textContent = self.t(n.getAttribute('data-i18n')); });
      ASD.util.qsa('[data-i18n-title]', root).forEach(function (n) {
        var v = self.t(n.getAttribute('data-i18n-title'));
        n.setAttribute('title', v);
        n.setAttribute('aria-label', v);
      });
      ASD.util.qsa('.lang-switch__button', root).forEach(function (b) {
        var on = b.getAttribute('data-lang') === self.lang;
        b.classList.toggle('lang-switch__button--active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
  };
})(window.ASD);
