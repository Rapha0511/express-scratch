const images = [
    'http://apartmentsinpanvel.com/wp-content/uploads/2019/06/3-BHK-Flats-in-Panvel.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiRTQ57tuya_aR03JgMZFWoJmtlUn2pwJKW-xfKqGdlz0yzh2N',
    'https://odis.homeaway.com/odis/listing/d04a0973-e931-4ebd-b68e-8aa928086a98.c10.jpg',
    'http://www.studentfacilitymanagement.com/wp-content/uploads/2015/03/slide-placeholder.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWrRsEflc3HIaHw0BxGE8nx5mR7LVhfIP-9tuTq5XOpnsXuIvx',
    'https://lid.zoocdn.com/354/255/97049dd72b1084be8135c5b885d814c3b14c4d25.jpg',
    'https://alto-live.s3.amazonaws.com/HVE8C8vjOy50QOXhTQsi75XJ1nM/X0DU7lM8vb7rqExtaLSSXHDOgfM/Photo/[3]/X4JsuYUrvk-zfm9g9yxA_g.jpg',
    'http://thelaceworks.com/wp-content/uploads/sites/5/2018/01/Roon-2.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWs_E3A-aHjPUuB_KjH1I30LVFkoFTOLX9UkQW1qggVCn38q_d',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS10C8bToGdQW-Zn5ND3PJJq06zMqx3pIGJttAdDXzfzrvBvVFyg'
]

const calculateHash = require('./hash')

const places = [
    'Downtown',
    'Uptown',
    'Yaletown',
    'west village',
    'beach Front',
    'english bay',
    'Jericho beach',
    'East Hastings',

];

const houses =[
    'luxury appartment',
    'Apartment',
    'garden apartment',
    'private house',
    'penthouse suite',
    'basement dwelling',
];

module.exports = {
    listing:[...Array(50)].map((o,i)=>({
        
            title: places[Math.floor(Math.random()*places.length)] + ' ' +  houses[Math.floor(Math.random()*houses.length)],
            description:'fucked'+i,
            price: 1000+Math.floor(Math.random()*500*i),
            images:[...Array(Math.floor(Math.random()*8)+2)].map(()=>
            images[Math.floor(Math.random()*images.length)]
            ),
                
            author : ( i%4 )+1,
        })),
        
   

    users: [

        {email: 'nik@nik.nik', passwordHash: calculateHash('guest'),role:'admin'},
        {email: 'raphael@raphael.nik', passwordHash:calculateHash ('guest'),role:'admin'},
        {email: 'putain@nik.nik', passwordHash:calculateHash ('guest'),role:'user'},
        {email: 'avi@nik.nik', passwordHash:calculateHash ('guest'),role:'user'},

    ],
}