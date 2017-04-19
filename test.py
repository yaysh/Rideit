import requests


url = "http://localhost:80/users"

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

createAccount()