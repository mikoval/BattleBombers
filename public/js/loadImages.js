function loadImages(){
    console.log("loading images")
    bomb_img = loadImage("/Images/Bomb.png"); 
    wall_img = loadImage("/Images/Wall.png"); 
    wood_img = loadImage("/Images/Wood.jpg"); 
    bomb_p_img = loadImage("/Images/Bomb+.png"); 
    boots_img = loadImage("/Images/Boots.png"); 
    fire_img = loadImage("/Images/Fire.jpg")
    bomb_s_img = loadImage("/Images/BombS.png")

    life_img = loadImage("/Images/Heart.png")
    ghost_img = loadImage("/Images/ghost.png")

    
    /*
    sword_forward_animation = loadAnimation("swordpics/front1.png", "swordpics/front4.png");
    sword_right_animation = loadAnimation("swordpics/right1.png", "swordpics/right4.png")
    sword_left_animation = loadAnimation("swordpics/left1.png", "swordpics/left4.png")
    sword_back_animation = loadAnimation("swordpics/back1.png", "swordpics/back4.png")
    sword_forward_stand = loadAnimation("swordpics/front1.png", "swordpics/front1.png");
    sword_right_stand = loadAnimation("swordpics/right1.png", "swordpics/right1.png")
    sword_left_stand = loadAnimation("swordpics/left1.png", "swordpics/left1.png")
    sword_back_stand = loadAnimation("swordpics/back1.png", "swordpics/back1.png")

    man_forward_animation = loadAnimation("manpics/front1.png", "manpics/front4.png");
    man_right_animation = loadAnimation("manpics/right1.png", "manpics/right4.png")
    man_left_animation = loadAnimation("manpics/left1.png", "manpics/left4.png")
    man_back_animation = loadAnimation("manpics/back1.png", "manpics/back4.png")
    man_forward_stand = loadAnimation("manpics/front1.png", "manpics/front1.png");
    man_right_stand = loadAnimation("manpics/right1.png", "manpics/right1.png")
    man_left_stand = loadAnimation("manpics/left1.png", "manpics/left1.png")
    man_back_stand = loadAnimation("manpics/back1.png", "manpics/back1.png")

    girl_forward_animation = loadAnimation("girlpics/front1.png", "girlpics/front7.png");
    girl_right_animation = loadAnimation("girlpics/right1.png", "girlpics/right7.png")
    girl_left_animation = loadAnimation("girlpics/left1.png", "girlpics/left7.png")
    girl_back_animation = loadAnimation("girlpics/back1.png", "girlpics/back7.png")
    girl_forward_stand = loadAnimation("girlpics/front1.png", "girlpics/front1.png");
    girl_right_stand = loadAnimation("girlpics/right1.png", "girlpics/right1.png")
    girl_left_stand = loadAnimation("girlpics/left1.png", "girlpics/left1.png")
    girl_back_stand = loadAnimation("girlpics/back1.png", "girlpics/back1.png")

    camel_forward_animation = loadAnimation("camelpics/front1.png", "camelpics/front3.png");
    camel_right_animation = loadAnimation("camelpics/right1.png", "camelpics/right3.png")
    camel_left_animation = loadAnimation("camelpics/left1.png", "camelpics/left3.png")
    camel_back_animation = loadAnimation("camelpics/back1.png", "camelpics/back3.png")
    camel_forward_stand = loadAnimation("camelpics/front1.png", "camelpics/front1.png");
    camel_right_stand = loadAnimation("camelpics/right1.png", "camelpics/right1.png")
    camel_left_stand = loadAnimation("camelpics/left1.png", "camelpics/left1.png")
    camel_back_stand = loadAnimation("camelpics/back1.png", "camelpics/back1.png")
    */

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