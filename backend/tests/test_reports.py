from datetime import date


def setup_user(client):
    payload = {
        'email': 'report@example.com',
        'password': 'password123',
        'name': 'Report User',
        'birth_date': date(1994, 10, 8).isoformat(),
        'birth_time': '12:05:00',
        'birth_place': 'Beijing'
    }
    client.post('/api/auth/register', json=payload)
    token = client.post('/api/auth/login', json={'email': payload['email'], 'password': payload['password']}).json()['access_token']
    return token


def test_generate_astrology_report(test_client):
    token = setup_user(test_client)
    response = test_client.post('/api/reports/astrology', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    payload = response.json()
    assert payload['payload']['sections']


def test_generate_zodiac_report(test_client):
    token = setup_user(test_client)
    response = test_client.post('/api/reports/zodiac', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    payload = response.json()
    assert payload['payload']['zodiac']
