from __future__ import annotations

from datetime import datetime
import random
from typing import Dict

from ..schemas import AstrologyReportPayload, ZodiacReportPayload, ReportSection


ASTRO_SECTIONS = {
    'overview': {
        'tag': '整体能量',
        'title': '整体能量概览',
        'summaries': [
            '星象呼唤你回到内在的秩序，让灵感转化为可执行的行动。',
            '行星编织出温柔的光网，支持你疗愈过往、拥抱未来。',
            '宇宙频率在你周围汇聚，提醒你以温柔的节奏开拓未知。',
            '星火相连，你的直觉与理性正在找到新的合作方式。'
        ],
        'details': [
            '适合进行心灵仪式，记录今日的启示与愿望。',
            '尝试与信任的人分享内心感受，会得到宇宙的回应。',
            '为自己设计晨间或夜间的小仪式，巩固与内在的承诺。',
            '把灵感化成三步行动计划，让灵性的指引真正落地。'
        ]
    },
    'love': {
        'tag': '亲密关系',
        'title': '感情关系',
        'summaries': [
            '金星被点亮，你渴望高质量的灵魂对话。',
            '你在亲密关系中的敏感与真诚被看见。',
            '心轮在此刻大开，适合表达深层需求与温柔。',
            '旧有的爱情叙事被改写，你愿意拥抱更高频的连结。'
        ],
        'details': [
            '单身者可多出席艺术/灵性活动，灵魂共振是吸引力法则。',
            '对伴侣坦承需要，让两人关系拥有温度与方向。',
            '为自己设定爱的界线，清晰沟通才能迎来真正的亲密。',
            '写下一封未寄出的情书，向内在的自己表达感恩与承诺。'
        ]
    },
    'career': {
        'tag': '事业财富',
        'title': '事业与财富',
        'summaries': [
            '水星助力计划与沟通，你的专业表达将更加清晰。',
            '长期目标有新的思路，谨慎评估、稳步推进。',
            '火星点燃执行力，适合为计划设定可衡量的里程碑。',
            '土星提供结构感，你的努力将换来稳定的回馈。'
        ],
        'details': [
            '整理任务清单，聚焦能带来长期价值的项目。',
            '财务方面留意重复支出，适时调整预算结构。',
            '为职业成长安排进修或认证，扩展新的专业领域。',
            '与信任的伙伴交流资源，共创双赢的合作蓝图。'
        ]
    },
    'wellbeing': {
        'tag': '身心疗愈',
        'title': '身心疗愈',
        'summaries': [
            '冥王星提醒你面对深层情绪，释放后才能焕然一新。',
            '保持与身体的连接，能量就会自然流动。',
            '月亮的节奏牵引你回归自我照料的日常仪式。',
            '内在疗愈之旅展开，允许自己慢下来感受脉搏与呼吸。'
        ],
        'details': [
            '安排一个与水元素相关的疗愈仪式，例如泡脚、SPA、冥想。',
            '记录今日感恩清单，让内在安全感被看见。',
            '透过瑜伽、舞动或伸展让身体说话，释放压抑的能量。',
            '调制一份疗愈香氛或茶饮，帮助心神回到中心。'
        ]
    }
}


ZODIAC_SECTIONS = {
    'energy': {
        'tag': '年度主题',
        'title': '年度能量场',
        'summaries': [
            '此年是能量的转折点，旧的模式被温柔地替换。',
            '你的存在感增强，宇宙邀请你走向舞台中央。',
            '太岁能量提醒你以柔克刚，稳步累积新的实力。',
            '命宫明亮，适合确立长线目标并坚持贯彻。'
        ],
        'details': [
            '上半年适合打基础，建立稳定的资源网络。',
            '下半年宜创新突破，保持自信与谦逊的平衡。',
            '留意与生肖相合的贵人，会带来关键的辅助与启示。',
            '每个月为自己设定主题词，引导行动与心念。'
        ]
    },
    'five-elements': {
        'tag': '五行调频',
        'title': '五行调频',
        'summaries': [
            '本命五行呈现出独特组合，需要以仪式补足不足元素。',
            '调和五行即是调和内在的阴阳与行动节奏。',
            '纳音五行点出能量失衡的线索，善用颜色与香气得以转化。',
            '五行之舞开启，觉察你的呼吸与姿态，便能回到中心。'
        ],
        'details': [
            '多接触自然，使用香、茶、音乐进行能量转化。',
            '通过颜色与材质的选择，让五行在日常中流动。',
            '记录身体对于不同食材、气候的反应，找出调养节奏。',
            '结合五行音阶或颂钵，让声音疗愈重塑你的频率。'
        ]
    },
    'relationship': {
        'tag': '人际贵人',
        'title': '人际与贵人',
        'summaries': [
            '贵人在灵感与学习领域出现，同行者会给你灵光。',
            '保持心的开放，新的协作关系正等待你。',
            '与生肖三合、六合的对象互动频繁，能激发崭新合作。',
            '人际磁场上升，留意职场或社群中出现的关键邀约。'
        ],
        'details': [
            '主动表达感谢，会强化与你的支持系统的连结。',
            '记得设定边界，适度保留能量给自己。',
            '每月约见一位启发你的朋友或导师，交换灵感与资源。',
            '当你愿意分享专业，贵人自然看见你的价值。'
        ]
    },
    'rituals': {
        'tag': '仪式指南',
        'title': '开运与安神仪式',
        'summaries': [
            '稳住日常仪式感，让生肖守护神明持续庇佑你。',
            '借助自然元素设计仪式，能帮助你在波动中保持定力。',
            '把祝福落实在生活细节，小小行动亦能撼动能场。'
        ],
        'details': [
            '在节气转换时点燃香或蜡烛，向天地致意并设定新意图。',
            '随身携带与你生肖相合的吉祥色或饰品，加强守护频率。',
            '每周安排一次静心书写，将灵感与梦想化为具体祈愿。',
            '善用净化喷雾、海盐浴或音叉，让空间与气场保持清明。'
        ]
    }
}


def pick_random(values):
    return random.choice(values)


def build_sections(config: Dict[str, Dict[str, list]]) -> list[ReportSection]:
    sections: list[ReportSection] = []
    for key, value in config.items():
        section = ReportSection(
            id=value.get('tag', key),
            title=value['title'],
            summary=pick_random(value['summaries']),
            details=value['details']
        )
        sections.append(section)
    return sections


def generate_astrology_report(sign: str, sun: str, moon: str, rising: str) -> AstrologyReportPayload:
    return AstrologyReportPayload(
        generated_at=datetime.utcnow(),
        sign=sign,
        sun=sun,
        moon=moon,
        rising=rising,
        sections=build_sections(ASTRO_SECTIONS)
    )


def generate_zodiac_report(zodiac: str, element: str, year: int) -> ZodiacReportPayload:
    return ZodiacReportPayload(
        generated_at=datetime.utcnow(),
        zodiac=zodiac,
        element=element,
        summary=pick_random([
            '今年的节奏强调内在力量的稳固，你的行动与信念正逐步对齐。',
            '这是调频的一年，懂得在前进与休息之间找到富有诗性的平衡。',
            '宇宙提示你以根基为先，在稳定中孕育新的突破与惊喜。',
            '贵人与灵感会在旅途中出现，请以开放的心拥抱每一段际遇。'
        ]),
        year=year,
        sections=build_sections(ZODIAC_SECTIONS)
    )

