//firebase link 
    //https://console.firebase.google.com/u/0/project/portfolio-website-58cdb/database/portfolio-website-58cdb-default-rtdb/data 


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import{ getDatabase ,ref,set,get,child,push } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA_3lYwtdxq8n7QsZv42aVXnG0a4yWMSWs",
  authDomain: "portfolio-website-58cdb.firebaseapp.com",
  projectId: "portfolio-website-58cdb",
  storageBucket: "portfolio-website-58cdb.appspot.com",
  messagingSenderId: "239479879240",
  appId: "1:239479879240:web:23e224357f90c5153a4a7d",
  measurementId: "G-VF7S8981ZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById('submit').addEventListener('click', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  if (name === '') {
    alert('Please Enter your name');
    return;
  }
  if (name.length<2) {
    alert('Name should be of at least 3 characters');
    return;
  }
  if (email === '') {
    alert('Please Enter your email');
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please Enter a valid email address');
            return;
        }

  if (message === '') {
    alert('Please Enter the message');
    return;
  }
  if (message.length<=2) {
    alert('Message should be of at least 2 characters');
    return;
  }

  const userRef = ref(db, 'users'); // Changed 'user' to 'users' for collection of users
  const newUserRef = push(userRef);

  set(newUserRef, {
    name: name,
    email: email,
    message: message
  })
  .then(() => {
    alert('Message sent successfully');
  })
  .catch((error) => {
    console.error('Error writing to Firebase Database', error);
  });
});




var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
  });




const contactSection = document.querySelector("#contactForm");
const aboutSection = document.querySelector("#aboutMe");


const skillandprojectSection = document.querySelector("#skills");

const experienceSection = document.querySelector("#experience");
const achievementsSection = document.querySelector("#achievements");
const contactFormSection = document.querySelector("#contactForm");


document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    contactSection.scrollIntoView({ behavior: "smooth" });
});



document.querySelector(".aboutme").addEventListener("click", (e) => {
    e.preventDefault();
    aboutSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".footabout").addEventListener("click", (e) => {
    e.preventDefault();
    aboutSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".skillandproject").addEventListener("click", (e) => {
    e.preventDefault();
    skillandprojectSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".experience").addEventListener("click", (e) => {
    e.preventDefault();
    experienceSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".achievements").addEventListener("click", (e) => {
    e.preventDefault();
    achievementsSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".contactform").addEventListener("click", (e) => {
    e.preventDefault();
    contactFormSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".footContact").addEventListener("click", (e) => {
    e.preventDefault();
    contactFormSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".footContact").addEventListener("click", (e) => {
    e.preventDefault();
    contactFormSection.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".hamburger").addEventListener("click", (e) => {
  e.preventDefault();
  var menu = document.querySelector('.navigationMenu');
  menu.classList.toggle('showMenu');
});
    

const footerElm = document.querySelector(".footer  ");
const main = document.querySelector(".navBar    ");

const scrollElement = document.createElement("div");
scrollElement.classList.add("scrollTop-style");

// I am adding the button element inside the div element
// scrollElement.innerHTML = ` <i class="fa-solid fa-circle-up scroll-top icon1 " title="Go To Top"></i>`;
// console.log(scrollElement)

// add to the bottom of the page
footerElm.after(scrollElement);

// deleting the dom element
const scrollTop = () => {
  console.log(1)
  console.log(main)
    main.scrollIntoView({ behavior: "smooth" });
};

document.querySelector(".scroll-top").addEventListener("click", scrollTop);
