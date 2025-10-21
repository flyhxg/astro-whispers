from datetime import date


def register_user(client, *, email='test@example.com', password='password123'):
    payload = {
        'email': email,
        'password': password,
        'name': 'Tester',
        'birth_date': date(1995, 3, 15).isoformat(),
        'birth_time': '08:30:00',
        'birth_place': 'Shanghai'
    }
    return client.post('/api/auth/register', json=payload)


def test_list_interpretations(test_client):
    response = test_client.get('/api/zodiac-interpretations')
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 12
    first = data[0]
    assert 'sign' in first and 'summary' in first
    assert any(item['sign'] == 'pisces' for item in data)


def test_get_interpretation_by_sign(test_client):
    response = test_client.get('/api/zodiac-interpretations/Leo')
    assert response.status_code == 200
    record = response.json()
    assert record['sign'] == 'leo'
    assert '舞台' in record['summary']


def test_update_interpretation_requires_authentication(test_client):
    detail = test_client.get('/api/zodiac-interpretations/aries').json()
    payload = {
        'title': detail['title'],
        'date_range': detail['date_range'],
        'element': detail['element'],
        'modality': detail['modality'],
        'keywords': detail['keywords'],
        'summary': detail['summary'],
        'love': detail['love'],
        'career': detail['career'],
        'wellbeing': detail['wellbeing'],
        'ritual': detail['ritual'],
        'mantra': detail['mantra'],
        'lucky_color': detail['lucky_color'],
    }

    unauth_response = test_client.put('/api/zodiac-interpretations/aries', json=payload)
    assert unauth_response.status_code == 401

    register_user(test_client, email='keeper@example.com', password='secret123')
    login_res = test_client.post('/api/auth/login', json={'email': 'keeper@example.com', 'password': 'secret123'})
    token = login_res.json()['access_token']

    payload['summary'] = '以更稳健的节奏点燃热情，白羊今年学会团队协作与策略布局。'

    update_res = test_client.put(
        '/api/zodiac-interpretations/aries',
        headers={'Authorization': f'Bearer {token}'},
        json=payload,
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated['summary'].startswith('以更稳健的节奏')

    confirm = test_client.get('/api/zodiac-interpretations/aries')
    assert confirm.status_code == 200
    assert confirm.json()['summary'].startswith('以更稳健的节奏')
