from __future__ import annotations

from datetime import datetime
import random
from typing import Dict

from ..schemas import AstrologyReportPayload, ZodiacReportPayload, ReportSection


ASTRO_SECTIONS = {
    'overview': {
        'title': '整体能量概览',
        'summaries': [
            '星象呼唤你回到内在的秩序，让灵感转化为可执行的行动。',
            '行星编织出温柔的光网，支持你疗愈过往、拥抱未来。'
        ],
        'details': [
            '适合进行心灵仪式，记录今日的启示与愿望。',
            '尝试与信任的人分享内心感受，会得到宇宙的回应。'
        ]
    },
    'love': {
        'title': '感情关系',
        'summaries': [
            '金星被点亮，你渴望高质量的灵魂对话。',
            '你在亲密关系中的敏感与真诚被看见。'
        ],
        'details': [
            '单身者可多出席艺术/灵性活动，灵魂共振是吸引力法则。',
            '对伴侣坦承需要，让两人关系拥有温度与方向。'
        ]
    },
    'career': {
        'title': '事业与财富',
        'summaries': [
            '水星助力计划与沟通，你的专业表达将更加清晰。',
            '长期目标有新的思路，谨慎评估、稳步推进。'
        ],
        'details': [
            '整理任务清单，聚焦能带来长期价值的项目。',
            '财务方面留意重复支出，适时调整预算结构。'
        ]
    },
    'wellbeing': {
        'title': '身心疗愈',
        'summaries': [
            '冥王星提醒你面对深层情绪，释放后才能焕然一新。',
            '保持与身体的连接，能量就会自然流动。'
        ],
        'details': [
            '安排一个与水元素相关的疗愈仪式，例如泡脚、SPA、冥想。',
            '记录今日感恩清单，让内在安全感被看见。'
        ]
    }
}


ZODIAC_SECTIONS = {
    'energy': {
        'title': '年度能量场',
        'summaries': [
            '此年是能量的转折点，旧的模式被温柔地替换。',
            '你的存在感增强，宇宙邀请你走向舞台中央。'
        ],
        'details': [
            '上半年适合打基础，建立稳定的资源网络。',
            '下半年宜创新突破，保持自信与谦逊的平衡。'
        ]
    },
    'five-elements': {
        'title': '五行调频',
        'summaries': [
            '本命五行呈现出独特组合，需要以仪式补足不足元素。',
            '调和五行即是调和内在的阴阳与行动节奏。'
        ],
        'details': [
            '多接触自然，使用香、茶、音乐进行能量转化。',
            '通过颜色与材质的选择，让五行在日常中流动。'
        ]
    },
    'relationship': {
        'title': '人际与贵人',
        'summaries': [
            '贵人在灵感与学习领域出现，同行者会给你灵光。',
            '保持心的开放，新的协作关系正等待你。'
        ],
        'details': [
            '主动表达感谢，会强化与你的支持系统的连结。',
            '记得设定边界，适度保留能量给自己。'
        ]
    }
}


def pick_random(values):
    return random.choice(values)


def build_sections(config: Dict[str, Dict[str, list]]) -> list[ReportSection]:
    sections: list[ReportSection] = []
    for key, value in config.items():
        section = ReportSection(
            id=key,
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
            '这是调频的一年，懂得在前进与休息之间找到富有诗性的平衡。'
        ]),
        year=year,
        sections=build_sections(ZODIAC_SECTIONS)
    )

