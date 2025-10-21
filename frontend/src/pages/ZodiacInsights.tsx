import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { ZodiacInterpretation, ZodiacInterpretationRecord } from '../types/zodiac'
import ZodiacHeartMap from '../components/ZodiacHeartMap'

const SIGN_ORDER = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
]

const ZODIAC_NAMES: Record<string, string> = {
  aries: '白羊座',
  taurus: '金牛座',
  gemini: '双子座',
  cancer: '巨蟹座',
  leo: '狮子座',
  virgo: '处女座',
  libra: '天秤座',
  scorpio: '天蝎座',
  sagittarius: '射手座',
  capricorn: '摩羯座',
  aquarius: '水瓶座',
  pisces: '双鱼座',
}

const ZODIAC_COMPATIBILITY: Record<
  string,
  {
    label: string
    essence: string
    bestMatches: { sign: string; label: string; notes: string }[]
    supportiveMatches: { sign: string; label: string; notes: string }[]
    growthNotes: string
    ritual: string
  }
> = {
  aries: {
    label: ZODIAC_NAMES.aries,
    essence:
      '火焰前行者，行动力强且渴望即刻回应，需要能跟上节奏、同时尊重其独立性的伴侣。',
    bestMatches: [
      {
        sign: 'leo',
        label: ZODIAC_NAMES.leo,
        notes: '共同燃烧愿景与荣耀，彼此助攻成为舞台焦点。',
      },
      {
        sign: 'sagittarius',
        label: ZODIAC_NAMES.sagittarius,
        notes: '冒险旅伴与精神同盟，持续点燃探索的热情。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'gemini',
        label: ZODIAC_NAMES.gemini,
        notes: '快速思维与弹性沟通，保持关系的灵动趣味。',
      },
      {
        sign: 'aquarius',
        label: ZODIAC_NAMES.aquarius,
        notes: '提供策略视角，协助白羊将冲劲转化为长期布局。',
      },
    ],
    growthNotes: '当情绪受挫时，练习先呼吸再出击，给彼此空间化解火花。',
    ritual: '建议本周以赤红蜡烛进行火元素冥想，稳定心火再迈步。',
  },
  taurus: {
    label: ZODIAC_NAMES.taurus,
    essence:
      '土象的宁静建设者，重视质感、稳定与长期承诺，需要安全感与共创的节奏。',
    bestMatches: [
      {
        sign: 'virgo',
        label: ZODIAC_NAMES.virgo,
        notes: '共同打磨生活细节，让日常成为浪漫的仪式。',
      },
      {
        sign: 'capricorn',
        label: ZODIAC_NAMES.capricorn,
        notes: '携手规划未来版图，稳健推进物质与精神的丰盛。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'cancer',
        label: ZODIAC_NAMES.cancer,
        notes: '温柔共振与情感滋养，令金牛更敢表达柔软面。',
      },
      {
        sign: 'pisces',
        label: ZODIAC_NAMES.pisces,
        notes: '艺术灵感与灵性陪伴，让稳定生活多了诗意波动。',
      },
    ],
    growthNotes: '学会在固执与妥协之间找到金线，适度尝试新体验。',
    ritual: '以绿色水晶排阵围绕香薰蜡烛，唤醒身体的愉悦与接纳。',
  },
  gemini: {
    label: ZODIAC_NAMES.gemini,
    essence:
      '风象信使，擅长沟通与快速切换主题，需要灵魂伴侣能一起漫游思想宇宙。',
    bestMatches: [
      {
        sign: 'libra',
        label: ZODIAC_NAMES.libra,
        notes: '对话中的平衡与审美共识，创造充满艺术气息的关系。',
      },
      {
        sign: 'aquarius',
        label: ZODIAC_NAMES.aquarius,
        notes: '一同脑暴未来计划，将创意落实成可执行蓝图。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'aries',
        label: ZODIAC_NAMES.aries,
        notes: '点燃行动力，避免停留在概念阶段。',
      },
      {
        sign: 'leo',
        label: ZODIAC_NAMES.leo,
        notes: '共同打造有趣的社交舞台，保持关系的玩心。',
      },
    ],
    growthNotes: '专注倾听并建立情绪容器，让对话不仅停留在理智。',
    ritual: '书写双人愿景清单，并于风中朗读，邀请宇宙响应。',
  },
  cancer: {
    label: ZODIAC_NAMES.cancer,
    essence:
      '月亮守护者，对情绪与归属高度敏感，渴望深层的情感依恋与互相照顾。',
    bestMatches: [
      {
        sign: 'pisces',
        label: ZODIAC_NAMES.pisces,
        notes: '灵魂共感与浪漫想象，编织柔软的心灵家园。',
      },
      {
        sign: 'scorpio',
        label: ZODIAC_NAMES.scorpio,
        notes: '情感深潜的伙伴，彼此成为最稳固的后盾。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'taurus',
        label: ZODIAC_NAMES.taurus,
        notes: '提供务实安全感，让巨蟹的敏感有落地的容器。',
      },
      {
        sign: 'virgo',
        label: ZODIAC_NAMES.virgo,
        notes: '细致呵护与健康生活方式，共筑温暖日常。',
      },
    ],
    growthNotes: '在照顾他人之前，先确认自己内在的需求已被看见。',
    ritual: '准备一杯热茶与日记本，书写“我值得接收的滋养”。',
  },
  leo: {
    label: ZODIAC_NAMES.leo,
    essence:
      '太阳王者，天生带着温暖与舞台感，需要崇敬其光芒又鼓励其脆弱面的灵魂伴侣。',
    bestMatches: [
      {
        sign: 'aries',
        label: ZODIAC_NAMES.aries,
        notes: '彼此映射勇气与热情，共同引领潮流。',
      },
      {
        sign: 'sagittarius',
        label: ZODIAC_NAMES.sagittarius,
        notes: '一起远征理想国度，保持关系的冒险张力。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'gemini',
        label: ZODIAC_NAMES.gemini,
        notes: '带来多元视角，使舞台故事更富层次。',
      },
      {
        sign: 'libra',
        label: ZODIAC_NAMES.libra,
        notes: '协助打造优雅仪式，提升关系的美学品质。',
      },
    ],
    growthNotes: '练习分享舞台，也给予对方被看见的时刻。',
    ritual: '以阳光金色调点亮居家角落，提醒自己：温柔亦是力量。',
  },
  virgo: {
    label: ZODIAC_NAMES.virgo,
    essence:
      '智慧编织者，注重细节与服务价值，渴望可以一起优化生活系统的伙伴。',
    bestMatches: [
      {
        sign: 'taurus',
        label: ZODIAC_NAMES.taurus,
        notes: '打造稳定的共生生态，舒缓彼此的不安。',
      },
      {
        sign: 'capricorn',
        label: ZODIAC_NAMES.capricorn,
        notes: '共同设定目标，用行动累积信任与成果。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'cancer',
        label: ZODIAC_NAMES.cancer,
        notes: '在温柔呵护中，学会脆弱与感性的表达。',
      },
      {
        sign: 'scorpio',
        label: ZODIAC_NAMES.scorpio,
        notes: '提供深度洞察，让处女座对亲密更有安全感。',
      },
    ],
    growthNotes: '停止批评模式，将注意力放在欣赏与庆祝已经达成的成果。',
    ritual: '整理生活角落并点燃薰衣草精油，释放身心的紧绷。',
  },
  libra: {
    label: ZODIAC_NAMES.libra,
    essence:
      '风中的调和者，追求关系的对称与美感，需要能与之共建仪式与精神伙伴关系的人。',
    bestMatches: [
      {
        sign: 'gemini',
        label: ZODIAC_NAMES.gemini,
        notes: '思想与美学的高频共振，拓展彼此的社交宇宙。',
      },
      {
        sign: 'aquarius',
        label: ZODIAC_NAMES.aquarius,
        notes: '一起探索新型关系模式，尊重自由又保持连结。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'leo',
        label: ZODIAC_NAMES.leo,
        notes: '提供耀眼舞台与自信鼓舞，鼓励天秤展现自我。',
      },
      {
        sign: 'sagittarius',
        label: ZODIAC_NAMES.sagittarius,
        notes: '激活冒险精神，让关系跳脱犹豫与徘徊。',
      },
    ],
    growthNotes: '练习直接表达需求，不再只扮演协调者角色。',
    ritual: '准备两张愿望卡，与伴侣互换阅读并写下彼此的回响。',
  },
  scorpio: {
    label: ZODIAC_NAMES.scorpio,
    essence:
      '冥王守护的深海旅者，渴望灵魂层面的契合与信任，拥有无与伦比的情感强度。',
    bestMatches: [
      {
        sign: 'cancer',
        label: ZODIAC_NAMES.cancer,
        notes: '共筑私密宇宙，拥有无言的情感默契。',
      },
      {
        sign: 'pisces',
        label: ZODIAC_NAMES.pisces,
        notes: '灵性与情绪的深潜旅伴，彼此疗愈旧有伤痕。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'virgo',
        label: ZODIAC_NAMES.virgo,
        notes: '以务实行动守护深情，使承诺得以显化。',
      },
      {
        sign: 'capricorn',
        label: ZODIAC_NAMES.capricorn,
        notes: '提供结构与耐心，帮助天蝎整合情绪波动。',
      },
    ],
    growthNotes: '允许信任逐渐生长，不急于用测试来验证忠诚。',
    ritual: '冥想时点上琥珀或檀香，释放旧有束缚与控制感。',
  },
  sagittarius: {
    label: ZODIAC_NAMES.sagittarius,
    essence:
      '自由的射手，追逐真理与远方，需要精神伴侣并肩拥抱变化。',
    bestMatches: [
      {
        sign: 'aries',
        label: ZODIAC_NAMES.aries,
        notes: '共谋冒险计划，彼此激发更宏大的梦想。',
      },
      {
        sign: 'leo',
        label: ZODIAC_NAMES.leo,
        notes: '在热情与乐观中共建丰盛生活。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'libra',
        label: ZODIAC_NAMES.libra,
        notes: '提供关系中的艺术化节奏，让自由与承诺共舞。',
      },
      {
        sign: 'aquarius',
        label: ZODIAC_NAMES.aquarius,
        notes: '共同探索未来愿景，在理想与现实间搭桥。',
      },
    ],
    growthNotes: '停下来倾听对方情绪细节，让热情不再成为忽略的借口。',
    ritual: '绘制下一个旅程愿景图，并写下想与谁共享。',
  },
  capricorn: {
    label: ZODIAC_NAMES.capricorn,
    essence:
      '山峰的攀登者，以耐心与纪律筑梦，需要互信、踏实且能共担责任的伴侣。',
    bestMatches: [
      {
        sign: 'taurus',
        label: ZODIAC_NAMES.taurus,
        notes: '在稳定节奏中筑造物质与精神的双丰收。',
      },
      {
        sign: 'virgo',
        label: ZODIAC_NAMES.virgo,
        notes: '彼此相互支持，将理想化为一步步计划。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'scorpio',
        label: ZODIAC_NAMES.scorpio,
        notes: '深度连结协助摩羯敞开心房，建立牢靠亲密。',
      },
      {
        sign: 'pisces',
        label: ZODIAC_NAMES.pisces,
        notes: '柔软情感与灵感补给，让专注不再孤单。',
      },
    ],
    growthNotes: '记得庆祝每一个小成就，不必将柔软藏在盔甲之下。',
    ritual: '在山形水晶旁写下年度共创计划，象征稳健登顶。',
  },
  aquarius: {
    label: ZODIAC_NAMES.aquarius,
    essence:
      '未来的构建者，重视精神与价值观契合，需要尊重自由又能与之并肩创新的伙伴。',
    bestMatches: [
      {
        sign: 'gemini',
        label: ZODIAC_NAMES.gemini,
        notes: '灵感火花与跨界合作，为关系注入前卫思维。',
      },
      {
        sign: 'libra',
        label: ZODIAC_NAMES.libra,
        notes: '共建理想社区与人际网络，一起设计心中的乌托邦。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'aries',
        label: ZODIAC_NAMES.aries,
        notes: '赋予行动助力，让愿景不再停留想象。',
      },
      {
        sign: 'sagittarius',
        label: ZODIAC_NAMES.sagittarius,
        notes: '带来全球视角，让想法落地于旅程。',
      },
    ],
    growthNotes: '真诚分享情绪与需求，不只交流理念与计划。',
    ritual: '与志同道合者举办线上分享，连接共同的未来蓝图。',
  },
  pisces: {
    label: ZODIAC_NAMES.pisces,
    essence:
      '梦境的航海者，感性而富有同理，渴望灵魂共鸣与温柔守护的连接。',
    bestMatches: [
      {
        sign: 'cancer',
        label: ZODIAC_NAMES.cancer,
        notes: '互相倾诉与疗愈，筑起水元素的安全感。',
      },
      {
        sign: 'scorpio',
        label: ZODIAC_NAMES.scorpio,
        notes: '深度情感交流与灵性探索，共同穿越潜意识。',
      },
    ],
    supportiveMatches: [
      {
        sign: 'taurus',
        label: ZODIAC_NAMES.taurus,
        notes: '提供稳定节奏，让梦想找到现实支撑。',
      },
      {
        sign: 'capricorn',
        label: ZODIAC_NAMES.capricorn,
        notes: '引导双鱼落实灵感，建立可持续结构。',
      },
    ],
    growthNotes: '设下健康界线，避免在共情中迷失自我。',
    ritual: '以海蓝宝石或音乐冥想，澄清内心讯息并释放沉重。',
  },
}

function mapRecord(record: ZodiacInterpretationRecord): ZodiacInterpretation {
  return {
    id: record.id,
    sign: record.sign,
    title: record.title,
    dateRange: record.date_range,
    element: record.element,
    modality: record.modality,
    keywords: record.keywords ?? [],
    summary: record.summary,
    love: record.love,
    career: record.career,
    wellbeing: record.wellbeing,
    ritual: record.ritual,
    mantra: record.mantra,
    luckyColor: record.lucky_color,
    updatedAt: record.updated_at,
  }
}

export default function ZodiacInsightsPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['zodiac-interpretations'],
    queryFn: async () => {
      const res = await api.get('/zodiac-interpretations')
      const records = res.data as ZodiacInterpretationRecord[]
      return records.map(mapRecord)
    },
  })

  const [activeSign, setActiveSign] = useState<string>(SIGN_ORDER[0])

  const interpretations = useMemo(() => {
    if (!data) return []
    return [...data].sort(
      (a, b) => SIGN_ORDER.indexOf(a.sign) - SIGN_ORDER.indexOf(b.sign)
    )
  }, [data])

  const activeCompatibility = ZODIAC_COMPATIBILITY[activeSign]

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">Zodiac Library</p>
        <h2 className="font-serif text-4xl text-white">12星座灵性解读</h2>
        <p className="text-sm text-white/60">
          精选的星座关键字、年度主题与实用仪式建议，帮助你在日常中落地星象智慧。
        </p>
        <div className="flex justify-center gap-3 text-xs text-white/50">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full border border-white/20 px-4 py-2 text-white/70 transition hover:bg-white/10"
          >
            {isRefetching ? '刷新中…' : '手动刷新最新解读'}
          </button>
          {isLoading && <span className="rounded-full border border-white/10 px-4 py-2">读取中…</span>}
          {isError && <span className="rounded-full border border-aurora/40 px-4 py-2 text-aurora">获取失败</span>}
        </div>
      </header>

      {isLoading && !data && (
        <div className="glass-card p-6 text-center text-white/70">正在载入星座解读…</div>
      )}

      {isError && !data && (
        <div className="glass-card p-6 text-center text-aurora">无法获取星座解读，请稍后再试。</div>
      )}

      <section className="space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Matching Atlas</p>
          <h3 className="font-serif text-3xl text-white">星座匹配心流图</h3>
          <p className="text-sm text-white/60">
            从心形罗盘读取情感磁场，探索最适合你能量频率的星座组合与共振仪式建议。
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-center">
          <ZodiacHeartMap
            signs={SIGN_ORDER.map((sign) => ({
              sign,
              label: ZODIAC_NAMES[sign],
            }))}
            activeSign={activeSign}
            onSelect={setActiveSign}
          />
          <div className="glass-card space-y-5 p-6 text-white/75">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-aurora/80">{activeCompatibility.label}</p>
              <h4 className="font-serif text-2xl text-white">{activeCompatibility.label}的爱情质地</h4>
              <p className="text-sm text-white/70">{activeCompatibility.essence}</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">灵魂共振</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {activeCompatibility.bestMatches.map((match) => (
                    <li key={match.sign} className="flex gap-2">
                      <span className="text-aurora">❤</span>
                      <span>
                        <span className="font-medium text-white">{match.label}</span>
                        <span className="ml-2 text-white/70">{match.notes}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">助力盟友</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {activeCompatibility.supportiveMatches.map((match) => (
                    <li key={match.sign} className="flex gap-2">
                      <span className="text-white/60">✦</span>
                      <span>
                        <span className="font-medium text-white">{match.label}</span>
                        <span className="ml-2 text-white/70">{match.notes}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-night/60 p-4 text-sm text-white/70">
                <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">能量提醒</p>
                <p className="mt-2">{activeCompatibility.growthNotes}</p>
                <p className="mt-3 text-aurora">{activeCompatibility.ritual}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {interpretations.map((item) => (
          <article key={item.id} className="glass-card flex h-full flex-col gap-5 p-6">
            <header className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-aurora/80">
                <span>{item.sign}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] text-white/60">
                  {item.element} · {item.modality}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[0.7rem] text-white/60">
                  幸运色：{item.luckyColor}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-2xl text-white">{item.title}</h3>
                <p className="text-xs text-white/50">{item.dateRange}</p>
                <p className="text-xs text-white/40">最近更新：{new Date(item.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-white/60">
                {item.keywords.map((keyword) => (
                  <span key={keyword} className="rounded-full bg-white/10 px-3 py-1">
                    #{keyword}
                  </span>
                ))}
              </div>
            </header>
            <section className="space-y-4 text-sm text-white/75">
              <p className="text-white/80">{item.summary}</p>
              <div className="grid gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-white/80">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">情感连结</p>
                  <p>{item.love}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">事业发展</p>
                  <p>{item.career}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">身心调养</p>
                  <p>{item.wellbeing}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-night/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-aurora/70">仪式建议</p>
                <p className="mt-2 text-white/80">{item.ritual}</p>
                <p className="mt-3 text-sm text-aurora">{item.mantra}</p>
              </div>
            </section>
          </article>
        ))}
      </div>
    </div>
  )
}
