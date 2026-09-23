import urllib.request, json

TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjljZTMxYjcwLWJmY2UtNDBlNS04MDE2LWQ2OTFlNzM4M2M5ZSIsImlhdCI6MTc5MDE3OTUwOSwic3ViIjoiZGV2ZWxvcGVyL2M4MmRjZWIzLTQyZDAtNDNkNy1iYTE4LTY2MTk0ZWZkNDMxOCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI4My41Ni4yNi4yNyJdLCJ0eXBlIjoiY2xpZW50In1dfQ.ANN_dt_QvJLYicqBsCjDXdZ7xVVIaTRLgMlkYiXb_s6ih4o8hLtvHf6r3NvrTQkVg8Ho4eX9qax9YQuZFyK7CA'

req = urllib.request.Request('https://api.clashroyale.com/v1/players/%23RR0UY29V', headers={'Authorization': 'Bearer ' + TOKEN})
resp = urllib.request.urlopen(req, timeout=10)
d = json.loads(resp.read())
print('Tag:', d.get('tag'))
print('Name (bytes):', d.get('name').encode('utf-8'))
print('Trophies:', d.get('trophies'))
print('Clan:', d.get('clan', {}).get('name', 'Sin clan') if d.get('clan') else 'Sin clan')
print('expLevel:', d.get('expLevel'))
print('kingLevel:', d.get('kingLevel'))
