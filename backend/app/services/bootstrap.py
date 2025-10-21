from __future__ import annotations

from datetime import datetime, timedelta
from typing import Iterable

from slugify import slugify
from sqlalchemy.orm import Session

from .. import models


ZODIAC_INTERPRETATIONS: list[dict[str, object]] = [
    {
        'sign': 'aries',
        'title': '白羊座 Aries',
        'date_range': '3月21日 - 4月19日',
        'element': '火元素',
        'modality': '基本宫',
        'keywords': ['行动力', '先锋精神', '率直'],
        'summary': '今年的白羊座像是重新点燃的火炬，你意识到勇敢不仅是冲锋，也包含照顾一路同行的人。你正在学习把热情化成持续的行动节奏。',
        'love': '亲密关系需要你练习倾听与回应。坦率表达渴望，但也别忘了留白给对方，让关系在真诚与尊重之间找到平衡。',
        'career': '工作上适合承担领导任务，主动提出解决方案会让你脱颖而出。设定清晰的阶段性目标，有助于团队信任你的判断。',
        'wellbeing': '注意身体的能量消耗，适度安排户外运动与伸展，帮助你释放累积的压力。保持规律的睡眠是补充战斗力的秘诀。',
        'ritual': '点燃一支带有辛香调的蜡烛，写下你最想实现的三个行动，并在蜡烛燃烧时冥想成功的画面。',
        'mantra': '「我带着热情而来，也以温柔守护收获。」',
        'lucky_color': '熔岩红',
    },
    {
        'sign': 'taurus',
        'title': '金牛座 Taurus',
        'date_range': '4月20日 - 5月20日',
        'element': '土元素',
        'modality': '固定宫',
        'keywords': ['价值感', '稳定', '感官享受'],
        'summary': '金牛座迎来资源整合的一年。你正在重新定义「拥有」的意义，不再执着于物质层面，而是学会投资在让你安心的关系与体验中。',
        'love': '情感生活温度渐升，适合与伴侣打造生活中的仪式感。单身者不妨参加与艺术、手作相关的活动，让灵感带来心动。',
        'career': '财务与职场有机会迎来稳健成长。检视旧有的收入结构，勇敢谈论自己的价值，会获得超出预期的回馈。',
        'wellbeing': '留意肩颈与喉咙部位的紧绷。用香气、音乐与按摩放松身体，搭配温润的饮食来滋养身心。',
        'ritual': '准备一个质地良好的日记本，把每一次感恩记录下来，持续三周，你会看见丰盛感被不断放大。',
        'mantra': '「我值得被丰盛拥抱，也懂得让丰盛流动。」',
        'lucky_color': '暖沙褐',
    },
    {
        'sign': 'gemini',
        'title': '双子座 Gemini',
        'date_range': '5月21日 - 6月21日',
        'element': '风元素',
        'modality': '变动宫',
        'keywords': ['好奇心', '表达', '多面向'],
        'summary': '对双子而言，这是探索叙事力的一年。你正在练习把纷乱的想法收拢成有力的故事，让自己的声音被世界听见。',
        'love': '恋爱运势轻盈，多认识新朋友会带来火花。稳定关系则需要建立新的沟通模式，让彼此的想法流动而不过载。',
        'career': '你在传播、教学、写作领域特别有灵感。善用社群或讲座分享观点，将会吸引同频的合作机会。',
        'wellbeing': '留意神经系统的疲劳。安排定期的数位断食，让大脑从资讯海中休息，才能维持灵感的新鲜度。',
        'ritual': '选择一首让你感到轻盈的音乐，在晨起时播放，并写下三个让你兴奋的新点子。',
        'mantra': '「我允许灵感流动，也给自己空间慢慢呈现。」',
        'lucky_color': '极光黄',
    },
    {
        'sign': 'cancer',
        'title': '巨蟹座 Cancer',
        'date_range': '6月22日 - 7月22日',
        'element': '水元素',
        'modality': '基本宫',
        'keywords': ['滋养', '直觉', '家庭'],
        'summary': '巨蟹座在疗愈与重建边界之间找到新平衡。你学习把关怀先给自己，才能在关系中给出更稳定的支持。',
        'love': '亲密关系进入深层对话阶段，适合讨论未来方向。单身者可透过心灵课程或读书会遇见志同道合之人。',
        'career': '职场上你展现出温柔而坚定的领导力。关注团队的情绪状态，会让你成为不可替代的核心。',
        'wellbeing': '消化系统是能量提醒的关键。多摄取温热食物，并在睡前进行腹式呼吸，帮助情绪慢慢沉淀。',
        'ritual': '准备一碗海盐水，轻触心口并默念感恩，想象海浪带走不再需要的情绪。',
        'mantra': '「我用柔软守护自己，也让世界感受我的力量。」',
        'lucky_color': '月光银',
    },
    {
        'sign': 'leo',
        'title': '狮子座 Leo',
        'date_range': '7月23日 - 8月22日',
        'element': '火元素',
        'modality': '固定宫',
        'keywords': ['创造力', '自信', '舞台'],
        'summary': '狮子座迎来舞台聚光的一年。你渴望展现真实的光芒，并吸引到愿意一起创造的伙伴。',
        'love': '浪漫指数高涨，与伴侣之间的互动变得热烈。单身狮子可透过艺术或公益活动结识闪耀的灵魂。',
        'career': '这是推出个人品牌或作品的好时机。记得在创造过程中兼顾团队合作，你的影响力将被进一步放大。',
        'wellbeing': '心脏与背部是重点。透过舞蹈、伸展或太阳礼拜来打开胸腔，让自信自然流动。',
        'ritual': '在日出时刻对着太阳写下今日的宣言，并用金色笔记本记录灵感。',
        'mantra': '「我天生闪耀，也愿与世界分享这份光。」',
        'lucky_color': '金耀橙',
    },
    {
        'sign': 'virgo',
        'title': '处女座 Virgo',
        'date_range': '8月23日 - 9月22日',
        'element': '土元素',
        'modality': '变动宫',
        'keywords': ['精致', '疗愈', '服务'],
        'summary': '处女座正把复杂系统重新梳理，打造更具韧性的生活结构。你的专注力与服务精神是今年最大的财富。',
        'love': '关系中需要更开放地分享你的脆弱与期待。真诚沟通，会发现伴侣也渴望与你一起升级生活。',
        'career': '适合投入策略规划、知识管理、健康顾问等领域。将流程自动化，可释放时间给真正重要的事。',
        'wellbeing': '注意肠胃与神经系统的调节。规律饮食、草本茶与冥想可以帮助身体恢复平衡。',
        'ritual': '每周挑选一天进行空间整理，并在过程中点上清新的香氛，提醒自己：整理即是疗愈。',
        'mantra': '「我允许自己在完美与松弛之间找到呼吸。」',
        'lucky_color': '苔绿',
    },
    {
        'sign': 'libra',
        'title': '天秤座 Libra',
        'date_range': '9月23日 - 10月23日',
        'element': '风元素',
        'modality': '基本宫',
        'keywords': ['平衡', '合作', '美学'],
        'summary': '天秤座迎来关系格局的大升级。你在协调各种观点的同时，也终于看见自己的真实需求。',
        'love': '伴侣关系朝向更成熟的沟通，适合规划共同目标。单身者可透过社交聚会或美学课程遇见知音。',
        'career': '合作案纷至沓来，记得提前设定界线与分工。你的谈判与协调能力是取得共识的关键。',
        'wellbeing': '腰部与肾脏需要细心照顾。多喝温水、保持轻松的律动，让身体维持柔软与平衡。',
        'ritual': '以白色或粉色花朵布置工作区，每日写下当天最感激的协助与连结。',
        'mantra': '「我尊重所有声音，也让自己的心获得安放。」',
        'lucky_color': '晨霞粉',
    },
    {
        'sign': 'scorpio',
        'title': '天蝎座 Scorpio',
        'date_range': '10月24日 - 11月22日',
        'element': '水元素',
        'modality': '固定宫',
        'keywords': ['洞察力', '深度', '转化'],
        'summary': '天蝎座在重生的旅程中越走越稳。你勇敢面对隐藏的恐惧，并把它们转化为推动生命的燃料。',
        'love': '感情的诚实度大幅提升。适合与伴侣探讨内在界线与信任议题。单身者会被深度对谈所吸引。',
        'career': '你在策略、心理、研究相关工作表现亮眼。深化专业并建立知识库，将成为你的护城河。',
        'wellbeing': '注意生殖与排毒系统。透过汗蒸、瑜伽或深层呼吸帮助能量流动。',
        'ritual': '点燃黑色或深紫色的蜡烛，写下你准备释怀的旧故事，并象征性地将纸张烧毁或埋藏。',
        'mantra': '「我拥抱阴影，因为它是光的另一面。」',
        'lucky_color': '星夜紫',
    },
    {
        'sign': 'sagittarius',
        'title': '射手座 Sagittarius',
        'date_range': '11月23日 - 12月21日',
        'element': '火元素',
        'modality': '变动宫',
        'keywords': ['远见', '学习', '拓展'],
        'summary': '射手座今年在学习与旅行中获得启示。你想把世界看得更辽阔，也愿意把信念化为具体的行动与分享。',
        'love': '跨文化或跨领域的连结带来火花。与伴侣规划共同成长的蓝图，会让关系更加稳固。',
        'career': '适合投入教育、出版、国际合作等领域。把经验整理成课程或内容，让你的智慧走得更远。',
        'wellbeing': '留意臀腿与肝胆系统。透过长距离散步、骑行或瑜伽，让身体在律动中找到自由。',
        'ritual': '制作一张愿景地图，把想实现的旅程与目标贴在显眼位置，每日花三分钟凝视并感受。',
        'mantra': '「我带着热忱探索，也把智慧慷慨分享。」',
        'lucky_color': '远航蓝',
    },
    {
        'sign': 'capricorn',
        'title': '摩羯座 Capricorn',
        'date_range': '12月22日 - 1月19日',
        'element': '土元素',
        'modality': '基本宫',
        'keywords': ['结构', '责任', '成就'],
        'summary': '摩羯座的长期规划正在开花结果。你学会在效率与身心照顾之间找到界线，才能走得长远。',
        'love': '关系中出现关于承诺与未来的讨论。适合规划共同投资或家庭蓝图。单身者会被务实、有规划的人吸引。',
        'career': '事业阶段来到晋升或转型的关键点。勇于要求资源，同时建立支持团队，你的高度决定格局。',
        'wellbeing': '骨骼与皮肤是重点。维持规律运动，并适度日晒补充能量。',
        'ritual': '在周日制定一周的结构化计划，并为自己安排至少两个放松的时段。',
        'mantra': '「我稳健攀爬，也享受沿途的风景。」',
        'lucky_color': '岩石灰',
    },
    {
        'sign': 'aquarius',
        'title': '水瓶座 Aquarius',
        'date_range': '1月20日 - 2月18日',
        'element': '风元素',
        'modality': '固定宫',
        'keywords': ['革新', '社群', '自由'],
        'summary': '水瓶座的创新能量全面开启。你想打造与众不同的系统，并吸引理念契合的伙伴加入。',
        'love': '关系需要更多自由与尊重。与伴侣建立新的相处规则，让彼此都有空间延展自我。',
        'career': '适合投入科技、社群经营、未来趋势相关项目。你的点子前卫但务实，能引领团队突破。',
        'wellbeing': '注意循环系统与小腿。多做伸展与水分补充，让能量顺畅流动。',
        'ritual': '写下你想带给世界的三项改变，并邀请可信赖的朋友一起头脑风暴实现方式。',
        'mantra': '「我尊重独特的自己，也凝聚改变的力量。」',
        'lucky_color': '星河蓝',
    },
    {
        'sign': 'pisces',
        'title': '双鱼座 Pisces',
        'date_range': '2月19日 - 3月20日',
        'element': '水元素',
        'modality': '变动宫',
        'keywords': ['灵感', '慈悲', '想象力'],
        'summary': '双鱼座在灵感与现实之间找到新的桥梁。你愿意把梦境化为实践，并照顾自己的界线与能量。',
        'love': '情感细腻而浪漫，但记得保持清晰的沟通。透过创作或音乐分享心意，会让亲密关系更贴近。',
        'career': '艺术、疗愈、服务领域有新的机会。把直觉转化为流程，让你的灵感能够持续被看见。',
        'wellbeing': '注意免疫与足部保养。使用薰衣草或洋甘菊精油泡脚，帮助身心放松。',
        'ritual': '在月光下写下你的心愿，并以水晶或海盐守护，持续七天观察直觉的讯息。',
        'mantra': '「我相信直觉，也勇于把灵感化为现实。」',
        'lucky_color': '海雾紫',
    },
]


MYSTIC_ARTICLES: list[dict[str, object]] = [
    {
        'title': '月相仪式指南：八个阶段的能量练习',
        'summary': '跟随月亮的节奏设计生活仪式，让愿望在盈亏之间萌芽与收成。',
        'tags': ['月相', '仪式', '身心灵'],
        'cover_url': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        'content': '\n'.join([
            '月亮的盈亏提醒我们：成长并非线性，而是螺旋式上升。',
            '新月适合设定意图，满月则是释放与收割的时刻。',
            '在每一个月相阶段写下你的感受，让心灵与宇宙同步呼吸。',
        ]),
        'days_ago': 12,
    },
    {
        'title': '以五行调频打造理想工作日',
        'summary': '运用木火土金水的节奏安排工作，效率与灵感都能被点亮。',
        'tags': ['五行', '职场', '能量管理'],
        'cover_url': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        'content': '\n'.join([
            '每一天都有对应的五行能量，周一属于月亮的水，适合整理情绪。',
            '当你理解不同元素的节奏，就能在高压时找到合适的调频方式。',
            '设计一个属于自己的元素例行公事，长期累积就是强大的内在结构。',
        ]),
        'days_ago': 26,
    },
    {
        'title': '占星与香气：为星座挑选守护香氛',
        'summary': '嗅觉与记忆紧密相关，挑选对应星座能量的香氛，让仪式更完整。',
        'tags': ['占星', '香氛', '感官疗愈'],
        'cover_url': 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
        'content': '\n'.join([
            '火象星座适合辛香与木质调，点燃行动力。',
            '土象星座偏好温润的草本香，让心安稳。',
            '风象星座可选择柑橘或花香，激发灵感；水象星座则需要带有海洋与白花的柔软。',
        ]),
        'days_ago': 40,
    },
    {
        'title': '写给灵魂的晨间书写练习',
        'summary': '花15分钟与自己对话，释放潜意识的讯息，让一天更清明。',
        'tags': ['书写', '灵感', '自我疗愈'],
        'cover_url': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
        'content': '\n'.join([
            '晨间书写是一种无评判的自我对话。',
            '当你持续三页的自由书写，潜意识会浮现真正的渴望。',
            '搭配一杯温热饮品，让这个仪式成为与灵魂联结的开始。',
        ]),
        'days_ago': 65,
    },
    {
        'title': '守护灵兽指南：寻找你的能量盟友',
        'summary': '透过冥想与象征符号找到守护灵兽，在生活中建立支持的象征。',
        'tags': ['灵性', '冥想', '象征学'],
        'cover_url': 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef',
        'content': '\n'.join([
            '守护灵兽是潜意识的化身，它提醒我们以不同视角看世界。',
            '当你在冥想中与它相遇，记得写下第一时间感受到的讯息。',
            '将象征物放在工作或生活空间，让守护能量伴随你的行动。',
        ]),
        'days_ago': 90,
    },
]


def _upsert_interpretations(db: Session, entries: Iterable[dict[str, object]]) -> None:
    for entry in entries:
        record = (
            db.query(models.ZodiacInterpretation)
            .filter(models.ZodiacInterpretation.sign == entry['sign'])
            .first()
        )
        if record:
            record.title = entry['title']  # type: ignore[assignment]
            record.date_range = entry['date_range']  # type: ignore[assignment]
            record.element = entry['element']  # type: ignore[assignment]
            record.modality = entry['modality']  # type: ignore[assignment]
            record.keywords = entry['keywords']  # type: ignore[assignment]
            record.summary = entry['summary']  # type: ignore[assignment]
            record.love = entry['love']  # type: ignore[assignment]
            record.career = entry['career']  # type: ignore[assignment]
            record.wellbeing = entry['wellbeing']  # type: ignore[assignment]
            record.ritual = entry['ritual']  # type: ignore[assignment]
            record.mantra = entry['mantra']  # type: ignore[assignment]
            record.lucky_color = entry['lucky_color']  # type: ignore[assignment]
        else:
            db.add(models.ZodiacInterpretation(**entry))


def _ensure_articles(db: Session, entries: Iterable[dict[str, object]]) -> None:
    for entry in entries:
        slug = slugify(entry['title'])
        article = db.query(models.Article).filter(models.Article.slug == slug).first()
        if article:
            continue
        published_at = datetime.utcnow() - timedelta(days=int(entry.get('days_ago', 0)))
        db.add(
            models.Article(
                title=entry['title'],
                slug=slug,
                summary=entry.get('summary'),
                cover_url=entry.get('cover_url'),
                tags=entry.get('tags', []),
                content=entry.get('content', ''),
                status='published',
                published_at=published_at,
            )
        )


def bootstrap_data(db: Session) -> None:
    """Populate baseline data for zodiac interpretations and mystic articles."""

    _upsert_interpretations(db, ZODIAC_INTERPRETATIONS)
    _ensure_articles(db, MYSTIC_ARTICLES)
    db.commit()
