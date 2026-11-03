// ==UserScript==
// @name         GitHub 汉化
// @namespace    https://github.com/Freedom-Wind123
// @version      0.1.0
// @description  把 GitHub 网页界面上的英文文案替换成中文。只翻译界面元素，不碰代码内容与用户输入。
// @author       Freedom-Wind123
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // ---------- 开关 ----------
  var STORE_KEY = 'gh-zh-enabled';
  function isEnabled() {
    try {
      if (typeof GM_getValue === 'function') {
        var v = GM_getValue(STORE_KEY, true);
        return v !== false && v !== 'false';
      }
    } catch (e) { /* ignore */ }
    try { return localStorage.getItem(STORE_KEY) !== 'false'; } catch (e) { return true; }
  }
  function setEnabled(v) {
    try {
      if (typeof GM_setValue === 'function') GM_setValue(STORE_KEY, v);
    } catch (e) { /* ignore */ }
    try { localStorage.setItem(STORE_KEY, v ? 'true' : 'false'); } catch (e) { /* ignore */ }
  }

  // ---------- 词表（精确匹配，避免误伤） ----------
  var DICT = {
    // 顶部导航 / 全局
    'Dashboard': '仪表盘',
    'Home': '首页',
    'Explore': '探索',
    'Marketplace': '市场',
    'Trending': '趋势',
    'Topics': '主题',
    'Collections': '合集',
    'Events': '活动',
    'Sponsors': '赞助者',
    'Notifications': '通知',
    'Inbox': '收件箱',
    'Pull requests': '拉取请求',
    'Issues': '议题',
    'Code': '代码',
    'Actions': '操作',
    'Projects': '项目',
    'Wiki': '维基',
    'Security': '安全',
    'Insights': '洞察',
    'Settings': '设置',
    'Discussions': '讨论',
    'Releases': '发行版',
    'Packages': '包',
    'Deployments': '部署',
    'Environments': '环境',
    'Search': '搜索',
    'Search or jump to...': '搜索或跳转到…',
    'Type / to search': '按 / 搜索',

    // 账号
    'Sign in': '登录',
    'Sign up': '注册',
    'Sign out': '退出登录',
    'Sign in to GitHub': '登录 GitHub',
    'Create an account': '创建账号',
    'Switch account': '切换账号',
    'Your profile': '个人资料',
    'Your repositories': '你的仓库',
    'Your projects': '你的项目',
    'Your stars': '你的标星',
    'Your gists': '你的代码片段',
    'Your organizations': '你的组织',
    'Your enterprises': '你的企业',
    'Profile': '个人资料',
    'Account': '账号',
    'Appearance': '外观',
    'Accessibility': '无障碍',
    'Billing and plans': '账单与套餐',
    'Emails': '邮箱',
    'Password and authentication': '密码与身份验证',
    'Sessions': '会话',
    'SSH and GPG keys': 'SSH 与 GPG 密钥',
    'Applications': '应用',
    'Developer settings': '开发者设置',

    // 仓库页
    'Overview': '概览',
    'Repositories': '仓库',
    'Stars': '标星',
    'Followers': '关注者',
    'Following': '正在关注',
    'Organizations': '组织',
    'About': '关于',
    'Readme': '自述文件',
    'README': '自述文件',
    'License': '许可证',
    'Activity': '动态',
    'Contributors': '贡献者',
    'Languages': '语言',
    'Tags': '标签',
    'Branches': '分支',
    'Commits': '提交',
    'Compare': '比较',
    'Blame': '追溯',
    'History': '历史',
    'Watch': '关注',
    'Unwatch': '取消关注',
    'Star': '标星',
    'Unstar': '取消标星',
    'Fork': '复刻',
    'Clone': '克隆',
    'Download ZIP': '下载 ZIP',
    'Open with GitHub Desktop': '用 GitHub Desktop 打开',
    'No description, website, or topics provided.': '暂无描述、网站或主题。',
    'No description provided.': '暂无描述。',
    'Add a description': '添加描述',
    'Edit repository details': '编辑仓库信息',
    'Public': '公开',
    'Private': '私有',
    'Archived': '已归档',
    'Template': '模板',
    'Forked from': '复刻自',

    // 提交 / 分支
    'Latest commit': '最新提交',
    'Commits on': '提交于',
    'Browse files': '浏览文件',
    'Go to file': '跳转到文件',
    'Add file': '添加文件',
    'Create new file': '新建文件',
    'Upload files': '上传文件',
    'Find file': '查找文件',
    'Copy path': '复制路径',
    'Copy permalink': '复制永久链接',
    'Raw': '原始文件',
    'Download raw file': '下载原始文件',
    'Open in github.dev': '在 github.dev 中打开',

    // 议题 / PR
    'Open': '开放',
    'Closed': '已关闭',
    'Merged': '已合并',
    'Draft': '草稿',
    'All': '全部',
    'Author': '作者',
    'Label': '标签',
    'Labels': '标签',
    'Milestone': '里程碑',
    'Milestones': '里程碑',
    'Assignee': '指派给',
    'Assignees': '指派给',
    'Reviewers': '审查者',
    'Participant': '参与者',
    'Type': '类型',
    'Sort': '排序',
    'Filter': '筛选',
    'New issue': '新建议题',
    'New pull request': '新建拉取请求',
    'Create issue': '创建议题',
    'Comment': '评论',
    'Close with comment': '评论并关闭',
    'Submit review': '提交审查',
    'Approve': '批准',
    'Request changes': '请求修改',
    'Files changed': '文件变更',
    'Checks': '检查',
    'Conversation': '对话',
    'Merge pull request': '合并拉取请求',
    'Squash and merge': '压缩并合并',
    'Rebase and merge': '变基并合并',
    'Create merge commit': '创建合并提交',
    'Confirm merge': '确认合并',
    'Delete branch': '删除分支',
    'Restore branch': '恢复分支',

    // 发行版
    'Latest': '最新',
    'Pre-release': '预发行',
    'Assets': '资源',
    'Source code (zip)': '源代码 (zip)',
    'Source code (tar.gz)': '源代码 (tar.gz)',

    // 通用按钮
    'New': '新建',
    'Create': '创建',
    'Add': '添加',
    'Edit': '编辑',
    'Delete': '删除',
    'Save': '保存',
    'Save changes': '保存更改',
    'Cancel': '取消',
    'Confirm': '确认',
    'Close': '关闭',
    'Reopen': '重新打开',
    'Merge': '合并',
    'Update': '更新',
    'Upload': '上传',
    'Download': '下载',
    'Copy': '复制',
    'Share': '分享',
    'Learn more': '了解更多',
    'Read more': '阅读更多',
    'Show more': '显示更多',
    'Show less': '收起',
    'Loading…': '加载中…',
    'Loading...': '加载中…',

    // 其它常见
    'Pinned': '置顶',
    'Popular repositories': '热门仓库',
    'Contribution activity': '贡献动态',
    'Contributions': '贡献',
    'Achievements': '成就',
    'Highlights': '亮点',
    'Pro tip': '小提示',
    'Feedback': '反馈',
    'Help': '帮助',
    'Docs': '文档',
    'Blog': '博客',
    'Contact': '联系',
    'Pricing': '定价',
    'Terms': '条款',
    'Privacy': '隐私',
    'Status': '状态',
    'Community': '社区',
    'Training': '培训'
  };

  // ---------- 带数字的短语 ----------
  var RULES = [
    [/^(\d[\d,]*)\s+Issues?$/, '$1 个议题'],
    [/^(\d[\d,]*)\s+Pull requests?$/, '$1 个拉取请求'],
    [/^(\d[\d,]*)\s+Discussions?$/, '$1 个讨论'],
    [/^(\d[\d,]*)\s+Stars?$/, '$1 个标星'],
    [/^(\d[\d,]*)\s+Forks?$/, '$1 个复刻'],
    [/^(\d[\d,]*)\s+Watchers?$/, '$1 人关注'],
    [/^(\d[\d,]*)\s+Contributors?$/, '$1 位贡献者'],
    [/^(\d[\d,]*)\s+Commits?$/, '$1 个提交'],
    [/^(\d[\d,]*)\s+Branches?$/, '$1 个分支'],
    [/^(\d[\d,]*)\s+Tags?$/, '$1 个标签'],
    [/^(\d[\d,]*)\s+files? changed$/, '$1 个文件变更']
  ];

  // ---------- 不该动的区域 ----------
  var SKIP_SELECTOR = [
    'pre', 'code', 'kbd', 'samp', 'var', 'textarea',
    '.blob-code', '.highlight', '.markdown-body', '.comment-body',
    '.js-file-line-container', '[data-testid="code-view"]',
    '.react-code-text', '.cm-editor', '.monaco-editor',
    'input', 'script', 'style', 'svg'
  ].join(',');

  function shouldSkip(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    if (!el) return true;
    return !!el.closest(SKIP_SELECTOR);
  }

  function translateString(text) {
    if (!text) return null;
    var m = DICT[text];
    if (m) return m;
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(text)) return text.replace(RULES[i][0], RULES[i][1]);
    }
    return null;
  }

  function translateTextNode(node) {
    if (!node || !node.nodeValue) return;
    var raw = node.nodeValue;
    var trimmed = raw.trim();
    if (!trimmed || trimmed.length > 60) return;
    if (shouldSkip(node)) return;
    var out = translateString(trimmed);
    if (out === null || out === trimmed) return;
    var start = raw.indexOf(trimmed);
    node.nodeValue = raw.slice(0, start) + out + raw.slice(start + trimmed.length);
  }

  var ATTRS = ['placeholder', 'aria-label', 'title'];
  function translateAttributes(el) {
    if (!el || el.nodeType !== 1) return;
    if (shouldSkip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      var v = el.getAttribute && el.getAttribute(a);
      if (!v) continue;
      var t = v.trim();
      var out = translateString(t);
      if (out !== null && out !== t) el.setAttribute(a, out);
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { translateTextNode(root); return; }
    if (root.nodeType !== 1) return;
    if (root.closest && root.closest(SKIP_SELECTOR)) return;

    translateAttributes(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) translateTextNode(n);

    var els = root.querySelectorAll('[placeholder], [aria-label], [title]');
    for (var i = 0; i < els.length; i++) translateAttributes(els[i]);
  }

  // ---------- 监听动态内容（GitHub 是单页应用） ----------
  var timer = null;
  var pending = new Set();
  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      if (r.type === 'characterData') { pending.add(r.target); }
      else {
        for (var j = 0; j < r.addedNodes.length; j++) pending.add(r.addedNodes[j]);
      }
    }
    if (timer) return;
    timer = setTimeout(function () {
      timer = null;
      var batch = Array.from(pending);
      pending.clear();
      for (var k = 0; k < batch.length; k++) {
        try { walk(batch[k]); } catch (e) { /* ignore */ }
      }
    }, 120);
  });

  function start() {
    walk(document.body);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    document.title = document.title.replace(/^GitHub\b/, 'GitHub');
  }
  function stop() { observer.disconnect(); }

  // ---------- 菜单开关 ----------
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('暂停/恢复汉化（刷新生效）', function () {
      setEnabled(!isEnabled());
      location.reload();
    });
  }

  if (isEnabled()) start();

  // 页面切换时补齐（部分路由不触发 body 级 Mutation）
  window.addEventListener('popstate', function () { if (isEnabled()) setTimeout(function () { walk(document.body); }, 300); });
})();
