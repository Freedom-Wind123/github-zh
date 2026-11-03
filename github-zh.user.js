// ==UserScript==
// @name         GitHub 汉化
// @namespace    https://github.com/Freedom-Wind123
// @version      0.1.1
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
    // ===== 顶部导航 / 全局 =====
    'Dashboard': '仪表盘',
    'Home': '首页',
    'Explore': '探索',
    'Marketplace': '市场',
    'Trending': '趋势',
    'Topics': '主题',
    'Collections': '合集',
    'Events': '活动',
    'Sponsors': '赞助者',
    'GitHub Sponsors': 'GitHub 赞助',
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
    'Skip to content': '跳到正文',
    'Navigation Menu': '导航菜单',
    'Products': '产品',
    'Solutions': '解决方案',
    'Resources': '资源',
    'Platform': '平台',
    'Open Source': '开源',
    'Enterprise': '企业版',
    'Copilot': 'Copilot',
    'Docs': '文档',
    'Documentation': '文档',
    'Blog': '博客',
    'Support': '支持',
    'Community': '社区',
    'Community Forum': '社区论坛',
    'Training': '培训',
    'Status': '状态',
    'GitHub Status': 'GitHub 状态',
    'Contact': '联系',
    'About': '关于',
    'Careers': '招聘',
    'Pricing': '定价',
    'Terms': '条款',
    'Privacy': '隐私',
    'Sitemap': '站点地图',
    'Changelog': '更新日志',
    'Integrations': '集成',
    'Customer Stories': '客户案例',
    'Partners': '合作伙伴',
    'Company': '公司',
    'Why GitHub': '为什么选 GitHub',
    'Team': '团队',
    'Startups': '初创公司',
    'Nonprofits': '非营利组织',
    'Healthcare': '医疗健康',
    'Financial services': '金融服务',
    'Manufacturing': '制造业',
    'Government': '政府',
    'See all industries': '查看所有行业',
    'Evaluate GitHub': '评估 GitHub',
    'Trust Center': '信任中心',
    'Add-ons': '附加组件',
    'Resource center': '资源中心',
    'Events & webinars': '活动与网络研讨会',
    'Customer support': '客户支持',
    'Premium Support': '高级支持',
    'All Features': '全部功能',
    'GitHub Universe': 'GitHub Universe',
    'Learn more': '了解更多',
    'See plans and pricing': '查看套餐与价格',
    'Manage cookies': '管理 Cookie',
    'Do not share my personal information': '不要共享我的个人信息',
    'Dismiss alert': '关闭提示',
    'Footer': '页脚',
    'Footer navigation': '页脚导航',

    // ===== 账号 =====
    'Sign in': '登录',
    'Sign up': '注册',
    'Sign out': '退出登录',
    'Sign in to GitHub': '登录 GitHub',
    'Sign up for GitHub': '注册 GitHub',
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
    'Appearance settings': '外观设置',
    'Accessibility': '无障碍',
    'Billing and plans': '账单与套餐',
    'Emails': '邮箱',
    'Email': '邮箱',
    'Password and authentication': '密码与身份验证',
    'Sessions': '会话',
    'SSH and GPG keys': 'SSH 与 GPG 密钥',
    'Applications': '应用',
    'Developer settings': '开发者设置',
    'Notifications settings': '通知设置',
    'Enter your email': '输入邮箱',

    // ===== 仓库页 =====
    'Overview': '概览',
    'Repositories': '仓库',
    'Stars': '标星',
    'Watchers': '关注者',
    'Forks': '复刻',
    'Followers': '关注者',
    'Following': '正在关注',
    'Organizations': '组织',
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
    'Report repository': '举报仓库',
    'Pin': '置顶',
    'Unpin': '取消置顶',
    'Pinned': '置顶',
    'Popular repositories': '热门仓库',
    'Contribution activity': '贡献动态',
    'Contributions': '贡献',
    'Achievements': '成就',
    'Highlights': '亮点',
    'Customize your pins': '自定义置顶',
    'Edit profile': '编辑个人资料',
    'Follow': '关注',
    'Unfollow': '取消关注',
    'Sponsor': '赞助',
    'Block': '屏蔽',
    'Report abuse': '举报滥用',
    'Joined': '加入于',
    'Location': '所在地',
    'Website': '网站',

    // ===== 提交 / 分支 / 文件 =====
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
    'Copy link': '复制链接',
    'Raw': '原始文件',
    'Download raw file': '下载原始文件',
    'Open in github.dev': '在 github.dev 中打开',
    'Edit this file': '编辑此文件',
    'Delete this file': '删除此文件',
    'Preview': '预览',
    'Commit changes': '提交更改',
    'Commit message': '提交信息',
    'Extended description': '详细描述',
    'Commit directly to the': '直接提交到',
    'Create a new branch for this commit and start a pull request': '为此提交新建分支并发起拉取请求',
    'Propose changes': '提议更改',
    'View commit details': '查看提交详情',
    'Browse repository at this point': '浏览此处的仓库',
    'Switch branches/tags': '切换分支/标签',
    'Find or create a branch...': '查找或新建分支…',
    'View all branches': '查看所有分支',
    'View all tags': '查看所有标签',
    'Create fork': '创建复刻',
    'Sync fork': '同步复刻',
    'Discard changes': '放弃更改',
    'Switch branches': '切换分支',
    'Default branch': '默认分支',
    'Protected': '受保护',
    'Add to list': '添加到列表',
    'Shortcuts': '快捷键',
    'Keyboard shortcuts': '键盘快捷键',

    // ===== 议题 / PR =====
    'Open': '开放',
    'Closed': '已关闭',
    'Merged': '已合并',
    'Draft': '草稿',
    'All': '全部',
    'Unread': '未读',
    'Done': '完成',
    'Saved': '已保存',
    'Author': '作者',
    'Label': '标签',
    'Labels': '标签',
    'Milestone': '里程碑',
    'Milestones': '里程碑',
    'Assignee': '指派给',
    'Assignees': '指派给',
    'Reviewers': '审查者',
    'Participant': '参与者',
    'Participants': '参与者',
    'Type': '类型',
    'Sort': '排序',
    'Filter': '筛选',
    'Filter by author': '按作者筛选',
    'New issue': '新建议题',
    'New pull request': '新建拉取请求',
    'Create issue': '创建议题',
    'Comment': '评论',
    'Close with comment': '评论并关闭',
    'Close issue': '关闭议题',
    'Reopen issue': '重新打开议题',
    'Close pull request': '关闭拉取请求',
    'Reopen pull request': '重新打开拉取请求',
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
    'Confirm squash and merge': '确认压缩并合并',
    'Confirm rebase and merge': '确认变基并合并',
    'Delete branch': '删除分支',
    'Restore branch': '恢复分支',
    'Ready for review': '可以审查',
    'Convert to draft': '转为草稿',
    'Add your review': '添加你的审查',
    'Subscribe': '订阅',
    'Unsubscribe': '取消订阅',
    'Quote reply': '引用回复',
    'Reference in new issue': '在新议题中引用',
    'Hide comment': '隐藏评论',
    'Search all issues': '搜索所有议题',
    'Clear current search query, filters, and sorts': '清除搜索词、筛选与排序',
    'List view': '列表视图',
    'Board view': '看板视图',
    'Created by': '创建者',
    'Mentions': '提及',
    'Assigned to': '指派给',
    'Sort by': '排序方式',
    'Newest': '最新',
    'Oldest': '最早',
    'Most commented': '评论最多',
    'Least commented': '评论最少',
    'Recently updated': '最近更新',
    'Least recently updated': '最久未更新',
    'Best match': '最佳匹配',
    'Most stars': '标星最多',
    'Most forks': '复刻最多',
    'No results matched': '没有匹配结果',

    // ===== 发行版 =====
    'Latest': '最新',
    'Pre-release': '预发行',
    'Assets': '资源',
    'Source code (zip)': '源代码 (zip)',
    'Source code (tar.gz)': '源代码 (tar.gz)',
    'Create a new release': '创建新发行版',
    'Choose a tag': '选择标签',
    'Release title': '发行版标题',
    'Describe this release': '描述此发行版',
    'Publish release': '发布发行版',
    'Save draft': '保存草稿',
    'Set as a pre-release': '设为预发行',
    'Set as the latest release': '设为最新发行版',

    // ===== 仓库设置 =====
    'General': '常规',
    'Repository name': '仓库名称',
    'Description': '描述',
    'Visibility': '可见性',
    'Change visibility': '更改可见性',
    'Danger Zone': '危险区域',
    'Transfer ownership': '转移所有权',
    'Delete this repository': '删除此仓库',
    'Archive this repository': '归档此仓库',
    'Collaborators and teams': '协作者与团队',
    'Webhooks': 'Webhook',
    'Secrets and variables': '密钥与变量',
    'Deploy keys': '部署密钥',
    'Pages': 'Pages',
    'Code security and analysis': '代码安全与分析',
    'Moderation options': '管理选项',

    // ===== 通知 =====
    'Participating': '参与中',
    'Mentioned': '被提及',
    'Team mentions': '团队提及',
    'Review requested': '请求审查',
    'Assigned': '已指派',
    'Mark as read': '标为已读',
    'Mark all as read': '全部标为已读',
    'Mark as done': '标为完成',

    // ===== 通用按钮 =====
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
    'More': '更多',
    'Show more': '显示更多',
    'Show less': '收起',
    'Read more': '阅读更多',
    'Loading…': '加载中…',
    'Loading...': '加载中…',
    'Reload': '重新加载',
    'Refresh': '刷新',
    'Back': '返回',
    'Next': '下一个',
    'Previous': '上一个',
    'Pro tip': '小提示',
    'Feedback': '反馈',
    'Help': '帮助',
    'Blog posts': '博客文章',
    'API': 'API',
    'Terms of Service': '服务条款',
    'Privacy Statement': '隐私声明',
    'Cookie preferences': 'Cookie 偏好',
    'Contact GitHub': '联系 GitHub',
    'Security overview': '安全概览',
    'Trust and safety': '信任与安全'
  };

  // ---------- 带数字的短语 ----------
  var RULES = [
    [/^(\d[\d,]*)\s+Issues?$/, '$1 个议题'],
    [/^(\d[\d,]*)\s+Pull requests?$/, '$1 个拉取请求'],
    [/^(\d[\d,]*)\s+Discussions?$/, '$1 个讨论'],
    [/^(\d[\d,]*)\s+Stars?$/, '$1 个标星'],
    [/^(\d[\d,]*)\s+Forks?$/, '$1 个复刻'],
    [/^(\d[\d,]*)\s+[Ww]atchers?$/, '$1 人关注'],
    [/^(\d[\d,]*)\s+watching$/, '$1 人正在关注'],
    [/^(\d[\d,]*)\s+Contributors?$/, '$1 位贡献者'],
    [/^(\d[\d,]*)\s+Commits?$/, '$1 个提交'],
    [/^(\d[\d,]*)\s+Branches?$/, '$1 个分支'],
    [/^(\d[\d,]*)\s+Tags?$/, '$1 个标签'],
    [/^(\d[\d,]*)\s+files? changed$/, '$1 个文件变更'],
    [/^(\d[\d,]*)\s+additions?$/, '$1 行新增'],
    [/^(\d[\d,]*)\s+deletions?$/, '$1 行删除'],
    [/^(\d[\d,]*)\s+files?$/, '$1 个文件'],
    [/^(\d[\d,]*)\s+comments?$/, '$1 条评论'],
    [/^(\d[\d,]*)\s+releases?$/, '$1 个发行版'],
    [/^(\d[\d,]*)\s+Packages?$/, '$1 个包'],
    [/^(\d[\d,]*)\s+Projects?$/, '$1 个项目'],
    [/^(\d[\d,]*)\s+Milestones?$/, '$1 个里程碑'],
    [/^(\d[\d,]*)\s+updated$/, '$1 个已更新']
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

  window.addEventListener('popstate', function () {
    if (isEnabled()) setTimeout(function () { walk(document.body); }, 300);
  });
})();
