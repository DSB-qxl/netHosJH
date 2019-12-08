<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <div id="localVideo" autoplay="autoplay" playsinline="playsinline"></div>
        <div id="remoteVideo" autoplay="autoplay" playsinline="playsinline"></div>
       
        <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404" />
        <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404" />
        <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404" />
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__info">
          All rights reserved
          <a
            style="color:#20a0ff"
            href="https://wallstreetcn.com"
            target="_blank"
          >wallstreetcn</a>
        </div>
        <div class="bullshit__headline">{{ message }}</div>
        <div
          class="bullshit__info"
        >Please check that the URL you entered is correct, or click the button below to return to the homepage.</div>
        <a href class="bullshit__return-home">Back to home</a>
      </div>
    </div>
  </div>
</template>

<script>
import TRTC from "trtc-js-sdk";
export default {
  name: "Page404",
  data() {
      return {
          user: {}
      }
  },
  computed: {
    message() {
      return "The webmaster said that you can not enter this page...";
    }
  },
  created() {
//    this.getUser()
    console.log(this.user.name)
    const client = TRTC.createClient({
      mode: "videoCall",
      sdkAppId: 1400290259,
      userId: "bf914",
      userSig:
        "eJwtzL0KwjAYheF7yaqULyG-BYcqxUHr0uDg1pJEPkQNtdaCeO*WtON5DrxfYo91NviO5IRlQNZpo-OPHgMmboOhfDle7tbEiI7klAMwA0yY*fFjxM5PLoRgADBrj-dkikvFNfClgtepa2mh*7JUst49YaTnra5svAzSN4dwcjSK6tMi26-UGzbk9we0Bi*p"
    });

    const localStream = TRTC.createStream({
      userId: "bf914",
      audio: true,
      video: true
    });
    client
      .join({ roomId: 4444 })
      .catch(error => {
        console.error("进房失败 " + error);
      })
      .then(() => {
        console.log("进房成功")
      });
    localStream
      .initialize()
      .catch(error => {
        console.error("初始化本地流失败 " + error)
      })
      .then(() => {
        console.log("初始化本地流成功")
        client
          .publish(localStream)
          .catch(error => {
            console.error("本地流发布失败 " + error)
          })
          .then(() => {
            console.log("本地流发布成功")
            localStream.play('localVideo')
          })
      })

    client.on("stream-added", event => {
      const remoteStream = event.stream
      console.log("远端流增加: " + remoteStream.getId())

      //订阅远端流
      client.subscribe(remoteStream)
    })
    client.on("stream-subscribed", event => {
      const remoteStream = event.stream
      console.log("远端流订阅成功：" + remoteStream.getId())

      // 播放远端流
      remoteStream.play("remote_stream-" + remoteStream.getId())
    })
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
};

</script>

<style lang="scss" scoped>
#localVideo {
  width: 320px;
  height: 240px;
  transform: rotateY(180deg);
  object-fit: cover;
}

.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
    &__child {
      position: absolute;
      &.left {
        width: 80px;
        top: 17px;
        left: 220px;
        opacity: 0;
        animation-name: cloudLeft;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      &.mid {
        width: 46px;
        top: 10px;
        left: 420px;
        opacity: 0;
        animation-name: cloudMid;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1.2s;
      }
      &.right {
        width: 62px;
        top: 100px;
        left: 500px;
        opacity: 0;
        animation-name: cloudRight;
        animation-duration: 2s;
        animation-timing-function: linear;
        animation-fill-mode: forwards;
        animation-delay: 1s;
      }
      @keyframes cloudLeft {
        0% {
          top: 17px;
          left: 220px;
          opacity: 0;
        }
        20% {
          top: 33px;
          left: 188px;
          opacity: 1;
        }
        80% {
          top: 81px;
          left: 92px;
          opacity: 1;
        }
        100% {
          top: 97px;
          left: 60px;
          opacity: 0;
        }
      }
      @keyframes cloudMid {
        0% {
          top: 10px;
          left: 420px;
          opacity: 0;
        }
        20% {
          top: 40px;
          left: 360px;
          opacity: 1;
        }
        70% {
          top: 130px;
          left: 180px;
          opacity: 1;
        }
        100% {
          top: 160px;
          left: 120px;
          opacity: 0;
        }
      }
      @keyframes cloudRight {
        0% {
          top: 100px;
          left: 500px;
          opacity: 0;
        }
        20% {
          top: 120px;
          left: 460px;
          opacity: 1;
        }
        80% {
          top: 180px;
          left: 340px;
          opacity: 1;
        }
        100% {
          top: 200px;
          left: 300px;
          opacity: 0;
        }
      }
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
