import requests


url = "http://138.68.161.176/users"

def login():
    payload = {"username": "jens", "password": "madsen"}
    r = requests.post(url + "/login", payload)
    print(r.json())


def createAccount():
    payload = {'username': 'jens', 'password': 'madsen', "phone": "0730312550", "driver": False}
    r = requests.post(url, payload)
    print(r.json())


def deleteAccount():
    while True:
        userInput = input("What id do you want to delete: ")
        if userInput == "n":
            return
        r = requests.delete(url + '/' + userInput)

def adduser():
    payload = {'username': 'jens', 'password': 'madsen', "phone": "0730312550"}
    r = requests.post("http://localhost:80/users/", data=payload)
    print(r.json())

login()