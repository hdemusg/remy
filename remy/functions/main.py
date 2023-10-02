# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
import os
import sys
import openai
import json
from metaphor_python import Metaphor

initialize_app()

cuisines = {
    "a": "American",
    "c": "Chinese",
    "f": "French",
    "g": "German",
    "i": "Indian",
    "j": "Japanese",
    "k": "Korean",
    "l": "Italian",
    "m": "Mediterranean",
    "n": "Nigerian",
    "t": "Thai",
    "x": "Mexican",
}

diets = {
    "vn": "vegan",
    "vg": "vegetarian",
    "ko": "kosher",
    "ha": "halal"
}

openai.api_key = os.getenv("OPENAI_KEY")
metaphor = Metaphor(os.getenv("METAPHOR_KEY"))

options.set_global_options(max_instances=10)

@https_fn.on_request()
def search(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": 'Content-Type',
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)
    data = req.get_json()
    cuisine_key = cuisines[data['c']]
    prompt = cuisine_key + " recipes"
    d = data['d']
    if d in diets:
        prompt = diets[d] + prompt
    if data['gluten']:
        prompt += ', gluten-free'
    if data['dairy']:
        prompt += ', dairy-free'   
    if data['nut']:
        prompt += ', nut-free'
    r = int(data['r'])
    response = metaphor.search(
            query=prompt, num_results=r,
            use_autoprompt=True
        )
    opts = []
    for o in response.results:
        entry = {}
        entry['title'] = o.title
        entry['url'] = o.url
        entry['id'] = o.id
        entry['score'] = o.score
        entry['published_date'] = o.published_date
        entry['author'] = o.author
        opts.append(entry)
    ret = {'results': opts}

    return json.dumps(ret), 200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"}

@https_fn.on_request()
def parse(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": 'Content-Type',
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)
    
    data = json.loads(req.get_json()['choice'])
    
    contents = metaphor.get_contents([data['id']])
    html = contents.contents[0].extract
        
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Please return the name, ingredients, and instructions of this recipe."},
            {"role": "user", "content": html},
        ],
    )
    sample = completion.choices[0].message.content
    portions = sample.split('\n\n')
    if len(portions) < 3:
        return json.dumps({"error": "GPT wasn't able to parse the ingredients and instructions for this recipe."}), 400, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"}
    w = portions[0].split(' ')
    if w[0] == "Title:" or w[0] == "Name:":
        title = portions[0][6:].strip()
    else:
        t = portions[0].split('"')
        title = t[1]
    n = portions[1].strip().split('\n')[1:]
    ing = []
    for x in n:
        v = x.strip()[1:].strip()
        ing.append(v)
    s = portions[2].strip().split('\n')[1:]
    ins = []
    for y in s:
        st = ""
        for a in y.split(".")[1:-1]:
            st += a.strip()
            st += '. '
        step = st.strip()
        if len(step) > 0:
            ins.append(step)

    ret = {'data': data, 'title': title, 'ingredients': ing, 'instructions': ins}
    headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": 'Content-Type',
            "Access-Control-Max-Age": "3600"}

    return json.dumps(ret), 200, headers

@https_fn.on_request()
def similar(req: https_fn.Request) -> https_fn.Response:
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": 'Content-Type',
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)
    data = req.get_json()
    url = cuisines[data['url']]
    r = int(data['r'])
    response = metaphor.find_similar(
            url, num_results=r,
            use_autoprompt=True
        )
    opts = []
    for o in response.results:
        entry = {}
        entry['title'] = o.title
        entry['url'] = o.url
        entry['id'] = o.id
        entry['score'] = o.score
        entry['published_date'] = o.published_date
        entry['author'] = o.author
        opts.append(entry)
    ret = {'results': opts}

    return json.dumps(ret), 200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"}

@https_fn.on_request()
def say_hello(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!")