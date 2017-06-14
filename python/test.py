import requests

#url = "http://138.68.161.176/users"
url = "http://yaysh.me/"

def main():
    # createAd()
    deleteUser()

def getTest():
    r = requests.get(url)
    print(r.json())

def login():
    payload = {"username": "jens", "password": "madsen"}
    r = requests.post(url + "/login", payload)
    print(r.json())

def createAccount():
    payload = {'username': 'jens', 'password': 'madsen', "phone": "11111", "driver": False}
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

def deleteUser():
    r = requests.delete("http://192.168.0.10:80/users/5940496cf83d522cfb36e70d")
    print (r.json())

def createAd():
    data = {
        "meetingPoint": "göteborg",
        "time": "07:30",
        "email": "jens@gmail.com",
        "name": "jens madsen",
        "phone": "073030303030",
        "isDriver": "false"
    }

    r = requests.post("http://yaysh.me/users/ad", data)
    print(r.json())


main()
