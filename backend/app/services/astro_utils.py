from datetime import date


WESTERN_SIGNS = [
    ((1, 20), '摩羯座'),
    ((2, 19), '水瓶座'),
    ((3, 21), '双鱼座'),
    ((4, 20), '白羊座'),
    ((5, 21), '金牛座'),
    ((6, 22), '双子座'),
    ((7, 23), '巨蟹座'),
    ((8, 23), '狮子座'),
    ((9, 24), '处女座'),
    ((10, 24), '天秤座'),
    ((11, 23), '天蝎座'),
    ((12, 22), '射手座'),
    ((12, 32), '摩羯座')
]

CHINESE_ZODIAC = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
FIVE_ELEMENTS = ['木', '火', '土', '金', '水']


def western_zodiac(birth_date: date) -> str:
    month = birth_date.month
    day = birth_date.day
    prev = '摩羯座'
    for boundary, sign in WESTERN_SIGNS:
        if (month, day) < boundary:
            return prev
        prev = sign
    return '摩羯座'


def chinese_zodiac(year: int) -> str:
    return CHINESE_ZODIAC[year % 12]


def five_element_by_year(year: int) -> str:
    # 定义纳音五行（简化版：根据 Heavenly Stem 取元素）
    stem = (year - 4) % 10
    mapping = {
        0: '木', 1: '木',
        2: '火', 3: '火',
        4: '土', 5: '土',
        6: '金', 7: '金',
        8: '水', 9: '水'
    }
    return mapping[stem]

