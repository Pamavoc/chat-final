import gsap from 'gsap/all';

export class Animation {
    constructor() {


        this.TL;

        this.star = document.querySelector('#star')
     
    }


    newUserShow(mesh) {
        this.TL = gsap.timeline({paused: true})
        this.TL.to(mesh.material, {opacity: 1, ease: "power0.easeIn", duration: 1}, 0)
        this.TL.play()
    }

    userDisappear(mesh) {
        console.log(mesh)
        this.TL = gsap.timeline({paused: true})
        this.TL.to(mesh.material, {opacity: 0, ease: "power0.easeOut", duration: 1}, 0)
        this.TL.play()
    }

    transitionHome() {
        this.TL = gsap.timeline({paused: true})
        
        this.TL.to(['.usernameWrapperSplash'], { duration: 0.4, ease: "power0.easeOut", opacity: 0}, 0)
        this.TL.to('#my-clip-path', {duration: 1, ease: "power0.easeOut", scale: 1}, 0)
        this.TL.to(['.background', '.motifs'], {duration: 0.5, ease: "power0.easeIn", opacity:0, visibility: "hidden"}, 1.25)
        
        this.TL.to('#my-clip-path', {duration: 0.75, ease: "power0.easeIn", scale: 100}, 1.25)
        this.TL.to(['.messagesZone', '.username-change', '.modifier', '.webgl', '.list-user'], {duration: 0.5, ease: "power2.easeIn", opacity: 1, visibility: "visible"}, 1.25)
        this.TL.to(['.ui'], {duration: 0, ease: "power2.easeIn", height: 0, width: 0}, 1.25)
        this.TL.play()
    }

    hideListUser() {
        this.TL = gsap.timeline({paused: true})
        this.TL.to(".list-user-close", {duration: 0.4, ease: "power0.easeOut", opacity: 0 }, 0)
        this.TL.to(".listUsers", {duration: 0.5, ease: "power0.easeOut", left: "-230px", opacity: 0})
        this.TL.to(".list-user", {duration: 0.5, ease: "power0.easeIn", opacity: 1, visibility: "visible" }, 1.2)
        
        this.TL.play()
    }

    showListUser() {
        this.TL = gsap.timeline({paused: true})
       
        this.TL.to(".list-user", {duration: 0.4, ease: "power0.easeOut", opacity: 0 }, 0)
        this.TL.to(".listUsers", {duration: 0.5, ease: "power0.easeOut", left: "1.5vh", opacity: 1, visibility: "visible"}, 0.5)
        this.TL.to(".list-user-close", {duration: 0.5, ease: "power0.easeIn", opacity: 1, visibility: "visible" }, 0.9)
        this.TL.play()
    }

    userDomHide(u) {
        this.TL = gsap.timeline({paused: true})
        this.TL.to(u, {duration: 0.5, ease: "power0.easeOut", opacity: 0})
        this.TL.add(() => {u.remove()}, 0.5)
        this.TL.play()
    }
    
   
}