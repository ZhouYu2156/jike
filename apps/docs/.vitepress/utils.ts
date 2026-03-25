import fs from 'fs'
import path from 'path'
import { DefaultTheme } from 'vitepress'

export const BASE_URL = '/jike/'

interface GenerateNavOptions {
  rootDir: string
  excludeDirs: string[]
  excludeFiles: string[]
  iconMap: Record<string, string>
  maxDepth: number
  autoCollapse: boolean
  titleMap?: Record<string, string>
}

type GenerateSidebarOptions = GenerateNavOptions

const root_path = path.resolve(__dirname, '../src')
/**
 * 获取目录的创建时间
 */
function getDirCreationTime(dirPath: string): number {
  try {
    const stats = fs.statSync(dirPath)
    return stats.birthtimeMs || stats.ctimeMs
  } catch (err) {
    return 0
  }
}

/**
 * 按创建时间排序目录 (早创建的排前面)
 */
function sortDirsByCreationTime(basePath: string, dirs: string[]): string[] {
  return dirs.sort((a, b) => {
    const timeA = getDirCreationTime(path.join(basePath, a))
    const timeB = getDirCreationTime(path.join(basePath, b))
    return timeA - timeB
  })
}

/**
 * 自动根据目录结构生成导航栏配置
 */
export function generateNav({
  rootDir = root_path,
  excludeDirs = ['node_modules', 'dist', 'build', 'public', 'docs', '.vitepress'],
  excludeFiles = ['README.md', 'index.md'],
  iconMap = {
    html: `${BASE_URL}nav-icons/html.png`,
    css: `${BASE_URL}nav-icons/css.png`,
    scss: `${BASE_URL}nav-icons/scss.png`,
    javascript: `${BASE_URL}nav-icons/javascript.png`,
    electron: `${BASE_URL}nav-icons/electron.png`,
    PhotoShop: `${BASE_URL}nav-icons/PhotoShop.png`,
    参考文档: '📚',
    生活: '🏠',
    工作: '💼',
    必会算法: '🧮️',
    设计模式: '✏️',
    vue: `${BASE_URL}nav-icons/vue.png`,
    react: `${BASE_URL}nav-icons/react.png`,
    nestjs: `${BASE_URL}nav-icons/nestjs.png`,
    nuxtjs: `${BASE_URL}nav-icons/nuxtjs.png`,
    koa: `${BASE_URL}nav-icons/koa.png`,
    express: `${BASE_URL}nav-icons/express.png`,
    mysql: `${BASE_URL}nav-icons/mysql.png`,
    redis: `${BASE_URL}nav-icons/redis.png`,
    mongodb: `${BASE_URL}nav-icons/mongodb.png`,
    centos: `${BASE_URL}nav-icons/centos.png`,
    Nginx: `${BASE_URL}nav-icons/nginx.png`,
    Docker: `${BASE_URL}nav-icons/docker.png`,
    GSAP: `${BASE_URL}nav-icons/gsap.png`,
    threejs: `${BASE_URL}nav-icons/threejs.png`,
    OpenAI: `${BASE_URL}nav-icons/openai.png`,
    nodejs: `${BASE_URL}nav-icons/nodejs.png`,
    python: `${BASE_URL}nav-icons/python.png`,
    Blender: `${BASE_URL}nav-icons/blender.png`,
    D3js: `${BASE_URL}nav-icons/d3js.svg`,
    濂湘诗词集: `${BASE_URL}nav-icons/濂湘诗词集.png`,
    濂湘文言大全: `${BASE_URL}nav-icons/濂湘文言大全.png`,
    世经: `${BASE_URL}nav-icons/世经.png`,
    常用TS方法: `${BASE_URL}nav-icons/常用TS方法.png`,
    谷歌浏览器插件: `${BASE_URL}nav-icons/谷歌浏览器插件.png`,
    VSCode: `${BASE_URL}nav-icons/VSCode.png`,
    开源工具: `${BASE_URL}nav-icons/开源工具.png`,
    桌面应用: `${BASE_URL}nav-icons/桌面应用.png`,
    演示代码: `${BASE_URL}nav-icons/演示代码.png`,
    桌面开发: `${BASE_URL}nav-icons/桌面开发.png`,
    支付宝: `${BASE_URL}nav-icons/alipay.png`,
  },
  titleMap = {
    web开发: '💻 Web开发',
    运维: '🛠️ 运维',
    设计: '🎨 设计',
    资源: '🧰 工具箱',
    深入前沿: '🔎 深入前沿',
    写作: '📖 写作',
  },
}: Partial<GenerateNavOptions> = {}): DefaultTheme.NavItem[] {
  const nav: DefaultTheme.NavItem[] = []
  const docsDir = path.resolve(process.cwd(), rootDir)

  // 获取一级目录并按创建时间排序
  const firstLevelDirs = sortDirsByCreationTime(
    docsDir,
    fs.readdirSync(docsDir).filter((file) => {
      const stat = fs.statSync(path.join(docsDir, file))
      return stat.isDirectory() && !excludeDirs.includes(file)
    }),
  )

  // 遍历一级目录
  for (const firstDir of firstLevelDirs) {
    const firstDirPath = path.join(docsDir, firstDir)
    const navItem: DefaultTheme.NavItem = {
      text: titleMap[firstDir] || firstDir,
      items: [],
    }

    // 获取二级目录并按创建时间排序
    const secondLevelDirs = sortDirsByCreationTime(
      firstDirPath,
      fs.readdirSync(firstDirPath).filter((file) => {
        const stat = fs.statSync(path.join(firstDirPath, file))
        return stat.isDirectory() && !excludeDirs.includes(file)
      }),
    )

    // 遍历二级目录
    for (const secondDir of secondLevelDirs) {
      const secondDirPath = path.join(firstDirPath, secondDir)
      const secondLevelItem: DefaultTheme.NavItemChildren = {
        text: secondDir,
        items: [],
      }

      // 获取三级目录并按创建时间排序
      const thirdLevelDirs = sortDirsByCreationTime(
        secondDirPath,
        fs.readdirSync(secondDirPath).filter((file) => {
          const stat = fs.statSync(path.join(secondDirPath, file))
          return stat.isDirectory() && !excludeDirs.includes(file)
        }),
      )

      // 遍历三级目录
      for (const thirdDir of thirdLevelDirs) {
        // 为每个三级目录创建链接
        const relativePath = path.join(firstDir, secondDir, thirdDir).replace(/\\/g, '/')

        // 检查当前目录名是否有对应的图标
        const icon = getIcon(thirdDir, iconMap)
        const linkItem: DefaultTheme.NavItemWithLink = {
          text: icon ? icon + thirdDir : thirdDir,
          link: `/${relativePath}/`,
        }

        // 如果图标是图片路径，则使用 span 包装
        if (icon && icon.includes('<img')) {
          linkItem.text = `<span class="icon">${icon}${thirdDir}</span>`
        }

        secondLevelItem.items.push(linkItem)
      }

      // 只有当三级目录不为空时，才添加到二级目录
      if (secondLevelItem.items.length > 0) {
        navItem.items.push(secondLevelItem)
      }
    }

    // 只有当二级目录不为空时，才添加到导航
    if (navItem.items.length > 0) {
      nav.push(navItem)
    }
  }

  return nav
}

/**
 * 根据目录名获取对应的图标
 */
function getIcon(dirName: string, iconMap: Record<string, string>): string {
  /** 目录名需要与iconMap的key完全匹配 */
  const key = Object.keys(iconMap).find((k) => k.toLowerCase() === dirName.toLowerCase())
  if (!key) return ''

  const icon = iconMap[key]
  if (icon.startsWith('/')) {
    return `<img src="${icon}"/>`
  }
  return icon + ' '
}

export function generateSidebar({
  rootDir = root_path,
  excludeDirs = ['node_modules', 'dist', 'build', 'public', 'docs', '.vitepress'],
  excludeFiles = ['README.md'],
  autoCollapse = false,
}: Partial<GenerateSidebarOptions> = {}): Record<string, DefaultTheme.SidebarItem[]> {
  const sidebar: Record<string, DefaultTheme.SidebarItem[]> = {}
  const docsDir = path.resolve(process.cwd(), rootDir)

  // 获取一级目录
  const firstLevelDirs = fs.readdirSync(docsDir).filter((file) => {
    const stat = fs.statSync(path.join(docsDir, file))
    return stat.isDirectory() && !excludeDirs.includes(file)
  })

  // 遍历一级目录
  for (const firstDir of firstLevelDirs) {
    const firstDirPath = path.join(docsDir, firstDir)

    // 获取二级目录
    const secondLevelDirs = fs.readdirSync(firstDirPath).filter((file) => {
      const stat = fs.statSync(path.join(firstDirPath, file))
      return stat.isDirectory() && !excludeDirs.includes(file)
    })

    // 遍历二级目录
    for (const secondDir of secondLevelDirs) {
      const secondDirPath = path.join(firstDirPath, secondDir)
      const relativePath = path.join(firstDir, secondDir).replace(/\\/g, '/')
      const sidebarKey = `/${relativePath}/`

      // 获取三级目录
      const thirdLevelDirs = sortDirsByCreationTime(
        secondDirPath,
        fs.readdirSync(secondDirPath).filter((file) => {
          const stat = fs.statSync(path.join(secondDirPath, file))
          return stat.isDirectory() && !excludeDirs.includes(file)
        }),
      )

      // 检查是否有任何三级目录包含非 index.md 的文件
      let hasNonIndexFiles = false
      const sidebarItems: DefaultTheme.SidebarItem[] = []

      // 遍历三级目录，为每个三级目录创建一个侧边栏组
      for (const thirdDir of thirdLevelDirs) {
        const thirdDirPath = path.join(secondDirPath, thirdDir)

        // 获取三级目录下的所有 Markdown 文件（排除 index.md）
        const mdFiles = sortFilesByCreationTime(
          thirdDirPath,
          fs.readdirSync(thirdDirPath).filter((file) => {
            const filePath = path.join(thirdDirPath, file)
            const stat = fs.statSync(filePath)
            return stat.isFile() && file.endsWith('.md') && file !== 'index.md' && !excludeFiles.includes(file)
          }),
        )

        // 如果有非 index.md 的文件，创建一个侧边栏组
        if (mdFiles.length > 0) {
          hasNonIndexFiles = true

          const sidebarGroup: DefaultTheme.SidebarItem = {
            text: thirdDir,
            collapsed: autoCollapse,
            items: [], // 明确初始化为空数组
          }

          // 处理 Markdown 文件
          for (const mdFile of mdFiles) {
            const fileName = mdFile.replace('.md', '')
            const filePath = path.join(firstDir, secondDir, thirdDir, mdFile).replace(/\\/g, '/')
            const link = `/${filePath}`

            // TypeScript 可能无法推断 items 已初始化，额外检查确保安全
            if (!sidebarGroup.items) {
              sidebarGroup.items = []
            }

            sidebarGroup.items.push({
              text: fileName,
              link: link,
            })
          }

          sidebarItems.push(sidebarGroup)
        }
      }

      // 只有当至少有一个三级目录包含非 index.md 文件时，才创建这个二级目录的侧边栏
      if (hasNonIndexFiles) {
        sidebar[sidebarKey] = sidebarItems
      }
    }
  }

  return sidebar
}

/**
 * 按创建时间排序文件 (早创建的排前面)
 */
function sortFilesByCreationTime(basePath: string, files: string[]): string[] {
  return files.sort((a, b) => {
    const timeA = getFileCreationTime(path.join(basePath, a))
    const timeB = getFileCreationTime(path.join(basePath, b))
    return timeA - timeB
  })
}

/**
 * 获取文件的创建时间
 */
function getFileCreationTime(filePath: string): number {
  try {
    const stats = fs.statSync(filePath)
    return stats.birthtimeMs || stats.ctimeMs
  } catch (err) {
    return 0
  }
}

/** 示例导航栏 */
/*export const navExample: DefaultTheme.NavItem[] = [
  {
    text: '💻 Web开发',
    items: [
      {
        text: '基础三件套', // 最大不超过三层嵌套, 第三层items必须是有link的链接项了
        items: [
          {
            text: '📄 HTML',
            link: '/web/基础三件套/html/',
          },
          {
            text: '🎨 CSS',
            link: '/web/基础三件套/css/',
          },
          {
            text: '💻 JavaScript',
            link: '/web/基础三件套/javascript/',
          },
        ],
      },
      {
        text: '前端框架',
        items: [
          {
            text: `<span class="icon"><img src="/nav-icons/vue.png"/>Vue</span>`,
            link: '/web/前端框架/vue/',
          },
          {
            text: '<span class="icon"><img src="/nav-icons/react.png"/>React</span>',
            link: '/web/前端框架/react/',
          },
        ],
      },
      {
        text: '后端框架',
        items: [
          {
            text: '<span class="icon"><img src="/nav-icons/nestjs.png"/>Nestjs</span>',
            link: '/web/后端框架/nestjs/',
          },
          {
            text: '<span class="icon"><img src="/nav-icons/nuxtjs.png"/>Nuxtjs</span>',
            link: '/web/后端框架/nuxt/',
          },
          {
            text: '<span class="icon"><img src="/nav-icons/koa.png"/>Koa</span>',
            link: '/web/后端框架/koa/',
          },
          {
            text: '<span class="icon"><img src="/nav-icons/express.png"/>Express</span>',
            link: '/web/后端框架/express/',
          },
        ],
      },
    ],
  },
]*/

/** 示例侧边栏 */
/*export const sidebarExample = {
  '/web/基础三件套/': [
    {
      text: 'HTML',
      collapsed: true,
      items: [
        {
          text: 'HTML基础',
          link: '/web/基础三件套/html/',
        },
        {
          text: 'HTML进阶',
          link: '/web/基础三件套/html/advanced.md',
        },
      ],
    },
    {
      text: 'CSS',
      collapsed: true,
      items: [
        {
          text: 'CSS基础',
          link: '/web/基础三件套/css/',
        },
        {
          text: 'CSS进阶',
          link: '/web/基础三件套/css/advanced.md',
        },
      ],
    },
    {
      text: 'JavaScript',
      collapsed: true,
      items: [
        {
          text: 'JavaScript基础',
          link: '/web/基础三件套/javascript/',
        },
        {
          text: 'JavaScript进阶',
          link: '/web/基础三件套/javascript/advanced.md',
        },
      ],
    },
  ],
}*/
