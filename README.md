# 罗凯锋的个人主页

个人主页源代码，使用原生 HTML、CSS 和 JavaScript 构建。

## 部署结构

- GitHub Pages：网页、照片、论文和课程笔记封面
- GitHub Releases：六份大型课程笔记 PDF

课程笔记 PDF 不进入 Git 历史，避免超过 GitHub 单文件大小限制。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173`。

## 发布到 GitHub

登录 GitHub CLI 后运行：

```bash
./scripts/deploy-github.sh
```

脚本会创建 `personal-homepage` 公共仓库、上传课程笔记 Release，并启用 GitHub Pages。
