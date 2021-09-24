
import { io } from "socket.io-client";
import { Animation } from "./Animation";
import { SceneChat } from "./SceneChat";


export default class Socketclient {
    constructor() {

        this.userInput = document.querySelector('.username')
        this.sendUserBtn = document.querySelector('.send-user')
        this.listUsers = document.querySelector('.listUsers')
        this.changeUsername = document.querySelector('.username-change')
        this.changeUsernameBtn = document.querySelector('.modifier')
        this.usersLogs = document.querySelector('.usersLogs')
        this.messageSend = document.querySelector('.send-message')

        this.messagesW = document.querySelector('.message-w')
        this.messagesZone = document.querySelector('.messagesZone')
        this.messageInput = document.querySelector('.messageInput')


        this.closeMenuBtn = document.querySelector('.list-user-close')
        this.openMenuBtn = document.querySelector('.list-user')



        this.init()

        this.animations = new Animation()

        this.sceneChat = new SceneChat(this.animations);

        this.messagesW.scrollTop = this.messagesW.scrollHeight;
        this.personnalId = null;

        this.messagesId = [];
        this.allUsers;

        this.allUsersDom;

        this.ioClient;
    }

    init() {


        this.ioClient = io("https://whispering-chamber-09886.herokuapp.com");
       

        this.ioClient.emit('getUsers')
        this.ioClient.emit('getMessages')


        this.ioClient.on("messages", (messages) => {

          
            messages.forEach(element => {

                if(element.value !== undefined) {
                    if(element.value.length >= 3 && element.value.length <= 650) {

                        this.createMessage(element)
                        
                    }
                }

             
              
            });

        })

        this.openMenuBtn.addEventListener("click", () => {
            this.animations.showListUser();
        })

        this.closeMenuBtn.addEventListener("click", () => {
            this.animations.hideListUser();
        })


        this.sendUserBtn.addEventListener('click', () => {

            this.animations.transitionHome()

            this.changeUsername.style.display = "block";
            document.querySelector('.usernameModifier').style.display = 'block'
          

            if(this.userInput.value === '') {
                this.changeUsername.value = 'Anonymous';
                this.ioClient.emit('setUsername', 'Anonymous')
            } else {
                this.changeUsername.value = this.userInput.value;
                this.ioClient.emit('setUsername', this.userInput.value)
            }
           
        }, { once: true });


        this.messageInput.addEventListener("keyup", (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {



                this.ioClient.emit('message', this.messageInput.value)
                this.messageInput.value = '';

            }
        })

        this.messageSend.addEventListener("click", (e) => {
            

            this.ioClient.emit('message', this.messageInput.value)
            this.messageInput.value = '';

            
        })

        this.changeUsername.addEventListener("keyup", (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {


                this.changeUsername.value = this.changeUsername.value;
                this.ioClient.emit('setUsername', this.changeUsername.value)

            }
        })


        this.ioClient.on('users', (users) => {

            this.allUsers = [...users]




            this.allUsers.forEach(user => {

                if(user.name !== '') {
                    this.createUser(user)
                }
               
            });
        })

        this.ioClient.on('userDisconnection', (user) => {



            if(this.allUsersDom !== undefined ) {
                this.allUsersDom.forEach(u => {
                    if(u.id === user.id) {
                        this.animations.userDomHide(u)
                        
                    }
                });
            }
          
            this.sceneChat.disposeUserMesh(user.id)
          
            
        })


        this.ioClient.on('updateUsername', (newUser) => {
          

            this.allUsersDom = [...document.querySelectorAll('.listUsers p')]

            this.allUsersDom.forEach(element => {
                if (element.id === newUser.id) {
                    element.innerHTML = newUser.name;
                }
            });



        })


        this.ioClient.on('userConnection', (user) => {

            if (this.personnalId === null) {

                this.personnalId = user.id;

            } else {
                this.allUsers.push(user)
            }


            this.sceneChat.newUserMesh(user.id)


        })





        this.ioClient.on('user', (user) => {

    
            if(user.name.length >= 1) {
                const el = document.createElement('p')
                el.innerHTML = user.name;
                this.listUsers.appendChild(el)
            }

            
        })


        this.ioClient.on('message', (message) => {

            if (message.value.length <= 650 && message.value.length >= 3) {
                
                if (message.user.id === this.personnalId) {
                    this.createMessage(message, true)
                } else {
                    this.createMessage(message, false)
                }

                this.doThing(message)
            } 

        
        })


    }

    doThing(message) {


        if(message.value.includes('Réel') || message.value.includes('vrai') || message.value.includes('vérité') || message.value.includes('rien')) {
            this.ioClient.emit('message', { type: 'bot', user: { id: this.personnalId, name: "Georgia O'Keeffe"}, value: 'Nothing is less real than realism. Details are confusing. It is only by selection, by elimination, by emphasis, that we get at the real meaning of things.'})
        }

        if(message.value.includes('Créer') || message.value.includes('artiste') || message.value.includes('toi') || message.value.includes('tu')) {
            this.ioClient.emit('message', { type: 'bot', user: { id: this.personnalId, name: "Georgia O'Keeffe"}, value: "To create one's own world takes courage."})
        }

        if(message.value.includes('Veux') || message.value.includes('vouloir')) {
            this.ioClient.emit('message', { type: 'bot', user: { id: this.personnalId, name: "Georgia O'Keeffe"}, value: "I can't live where I want to, I can't go where I want to go, I can't do what I want to, I can't even say what I want to. I decided I was a very stupid fool not to at least paint as I wanted to."})
        }
    }

    createUser(user) {

        

        if(user.name.length >= 1 && user.name !== '' && user.name.length <= 30) { 
            const u = document.createElement('p')
            u.id = user.id;
            u.innerHTML = user.name;
            u.classList.add('user')
    
            this.listUsers.append(u)
        }
     

    }


    noMessage() {

    }

    

    createMessage(message, personnal) {

        // CONTAINER GLOBAL 
        const messageContainer = document.createElement('div')
        messageContainer.classList.add("message-el");

        if (personnal === true) {
            messageContainer.classList.add('personnal-message');

            // console.log(this.messagesId)

            // this.lastMessage = document.querySelector(this.messagesId[this.messagesId.length - 1]);

            // console.log(this.lastMessage)
        }


        // Auteur, date
        const messageInfo = document.createElement('div')
        messageInfo.classList.add('message-info')

        const author = document.createElement('p')
        author.classList.add("author")
        author.innerHTML = message.user.name;

        const d = new Date(message.time)
        const time = document.createElement('p')
        time.classList.add('time');

        time.innerHTML = `${d.getHours()} : ${d.getMinutes()}`
      

        messageInfo.appendChild(author)
        messageInfo.appendChild(time)
        messageContainer.appendChild(messageInfo)
        const el = document.createElement('div')

        // Content
        el.id = message.id;
        el.innerHTML = message.value;

        if (personnal === true) {
            el.classList.add("message-content-right")
            const corner = document.createElement('img')
            corner.setAttribute('src', '../assets/img/corner-right.svg')
            corner.classList.add('corner-right')
            el.appendChild(corner)

            // const star = document.createElement('img')
            // star.setAttribute('src', '/star.svg')
            // star.classList.add('star-right')
            // el.appendChild(star)


        } else {
            el.classList.add("message-content-left")
            const corner = document.createElement('img')
            corner.setAttribute('src', '../assets/img/cornerleft.svg')
            corner.classList.add('corner-left')
            el.appendChild(corner)

            // const star = document.createElement('img')
            // star.setAttribute('src', '/star.svg')
            // star.classList.add('star-left')
            // el.appendChild(star)
        }

        messageContainer.appendChild(el)
        
    

        this.messagesW.scrollTop =  this.messagesW.scrollHeight;


        this.messagesW.appendChild(messageContainer)
    }

  
}