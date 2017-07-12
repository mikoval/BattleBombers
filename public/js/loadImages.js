function loadImages(){
    //2d materials
    console.log("loading images")
    bomb_img = loadImage("/Images/Bomb.png"); 
    wall_img = loadImage("/Images/Wall3.jpg"); 
    wood_img = loadImage("/Images/Wood3.jpg"); 
    bomb_p_img = loadImage("/Images/Bomb+.png"); 
    boots_img = loadImage("/Images/Boots.png"); 
    fire_img = loadImage("/Images/Fire.jpg")
    bomb_s_img = loadImage("/Images/BombS.png")

    life_img = loadImage("/Images/Heart.png")
    ghost_img = loadImage("/Images/ghost.png")


    //3d materials
    var texloader = new THREE.TextureLoader();
    woodtext=texloader.load("/Images/Wood3.jpg");
    woodMaterial = new THREE.MeshPhongMaterial({ map: woodtext });
    walltext=texloader.load("/Images/Wall3.jpg");
    wallMaterial = new THREE.MeshPhongMaterial({ map: walltext });
    firetext=texloader.load("/Images/Fire.jpg");
    fireMaterial = new THREE.MeshPhongMaterial({ map: firetext });

    lifetext=texloader.load("/Images/Heart.png");
    lifeMaterial = new THREE.MeshPhongMaterial({ map: lifetext });
    bootstext=texloader.load("/Images/boots2.png");
    bootsMaterial = new THREE.MeshPhongMaterial({ map: bootstext });
    bombstext=texloader.load("/Images/BombS.png");
    bombsMaterial = new THREE.MeshPhongMaterial({ map: bombstext });
    bombptext=texloader.load("/Images/Bomb+.png");
    bombpMaterial = new THREE.MeshPhongMaterial({ map: bombptext });
    ghosttext=texloader.load("/Images/ghost.png");
    ghostMaterial = new THREE.MeshPhongMaterial({ map: ghosttext });
    marbletext=texloader.load("/Images/grass.png");
    marbleMaterial = new THREE.MeshPhongMaterial({ map: marbletext });



    
    //animations
    fox_forward_animation = loadAnimation("/Images/FoxPics/front1.png", "/Images/FoxPics/front6.png");
    fox_right_animation = loadAnimation("/Images/FoxPics/right1.png", "/Images/FoxPics/right6.png")
    fox_left_animation = loadAnimation("/Images/FoxPics/left1.png", "/Images/FoxPics/left6.png")
    fox_back_animation = loadAnimation("/Images/FoxPics/back1.png", "/Images/FoxPics/back6.png")
    fox_forward_stand = loadAnimation("/Images/FoxPics/front1.png", "/Images/FoxPics/front1.png");
    fox_right_stand = loadAnimation("/Images/FoxPics/right1.png", "/Images/FoxPics/right1.png")
    fox_left_stand = loadAnimation("/Images/FoxPics/left1.png", "/Images/FoxPics/left1.png")
    fox_back_stand = loadAnimation("/Images/FoxPics/back1.png", "/Images/FoxPics/back1.png")

    bun_forward_animation = loadAnimation("/Images/bunpics/front1.png", "/Images/bunpics/front6.png");
    bun_right_animation = loadAnimation("/Images/bunpics/right1.png", "/Images/bunpics/right6.png")
    bun_left_animation = loadAnimation("/Images/bunpics/left1.png", "/Images/bunpics/left6.png")
    bun_back_animation = loadAnimation("/Images/bunpics/back1.png", "/Images/bunpics/back6.png")
    bun_forward_stand = loadAnimation("/Images/bunpics/front1.png", "/Images/bunpics/front1.png");
    bun_right_stand = loadAnimation("/Images/bunpics/right1.png", "/Images/bunpics/right1.png")
    bun_left_stand = loadAnimation("/Images/bunpics/left1.png", "/Images/bunpics/left1.png")
    bun_back_stand = loadAnimation("/Images/bunpics/back1.png", "/Images/bunpics/back1.png")

    jones_forward_animation = loadAnimation("/Images/jonespics/front1.png", "/Images/jonespics/front6.png");
    jones_right_animation = loadAnimation("/Images/jonespics/right1.png", "/Images/jonespics/right6.png")
    jones_left_animation = loadAnimation("/Images/jonespics/left1.png", "/Images/jonespics/left6.png")
    jones_back_animation = loadAnimation("/Images/jonespics/back1.png", "/Images/jonespics/back6.png")
    jones_forward_stand = loadAnimation("/Images/jonespics/front1.png", "/Images/jonespics/front1.png");
    jones_right_stand = loadAnimation("/Images/jonespics/right1.png", "/Images/jonespics/right1.png")
    jones_left_stand = loadAnimation("/Images/jonespics/left1.png", "/Images/jonespics/left1.png")
    jones_back_stand = loadAnimation("/Images/jonespics/back1.png", "/Images/jonespics/back1.png")

    spear_forward_animation = loadAnimation("/Images/spearpics/front1.png", "/Images/spearpics/front6.png");
    spear_right_animation = loadAnimation("/Images/spearpics/right1.png", "/Images/spearpics/right6.png")
    spear_left_animation = loadAnimation("/Images/spearpics/left1.png", "/Images/spearpics/left6.png")
    spear_back_animation = loadAnimation("/Images/spearpics/back1.png", "/Images/spearpics/back6.png")
    spear_forward_stand = loadAnimation("/Images/spearpics/front1.png", "/Images/spearpics/front1.png");
    spear_right_stand = loadAnimation("/Images/spearpics/right1.png", "/Images/spearpics/right1.png")
    spear_left_stand = loadAnimation("/Images/spearpics/left1.png", "/Images/spearpics/left1.png")
    spear_back_stand = loadAnimation("/Images/spearpics/back1.png", "/Images/spearpics/back1.png")
}