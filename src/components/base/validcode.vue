<template>
  <div class="box">
    <canvas style="" :width="contentWidth" :height="contentHeight" id="cav" @click="next()"></canvas>
  </div>
</template>

<script>

export default {
  name: 'verificationCode',
  props: {
    fontSize: {
      type: Number,
      default: 20
    },
    contentWidth: {
      type: Number,
      default: 80
    },
    contentHeight: {
      type: Number,
      default: 32
    },
    verification: {
      type: String
    },
    refreshCode: {
      type: Boolean
    }
  },
  watch: {
    verification: function (newVal) {
      if (newVal.toLowerCase() === this.identify.toLowerCase()) {
        this.$emit('handleIdentify', true)
      } else {
        this.$emit('handleIdentify', false)
      }
    },
    refreshCode: function (newVal) {
      this.draw()
    }
  },
  mounted () {
    this.draw()
  },
  data () {
    return {
      identify: '',
      letter: [2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  methods: {
    draw () {
      let self = this
      let text = this.randomNum()
      this.identify = text.join('')
      let ctx = document.getElementById('cav')
      let cav = ctx.getContext('2d')
      cav.clearRect(0, 0, self.contentWidth, self.contentHeight)
      let w = ctx.width
      let h = ctx.height
      cav.textBaseline = 'bottom'
      self.drawText(cav, text[0], 10, 10, self.randomDeg(0, 0.1), 20)
      self.drawText(cav, text[1], 20, 10, self.randomDeg(0, 0.1))
      self.drawText(cav, text[2], 25, 10, self.randomDeg(0, 0.1))
      self.drawText(cav, text[3], 30, 10, self.randomDeg(0, 0.1))
      let i
      for (i = 0; i < 3; i++) {
        self.drawLine(cav, self.randomDeg(0, 0.3 * w, 1), self.randomDeg(0, h, 1), self.randomDeg(0, w, 1), self.randomDeg(0, h, 1), self.randomDeg(0.8 * w, w, 1), self.randomDeg(0, h, 1))
      }
    },
    drawText (cav, text, x1, y1, route) {
      cav.beginPath()
      cav.fillStyle = '#ffe9db'
      cav.font = this.fontSize + 'px' + ' ' + '黑体'
      cav.translate(x1, y1)
      cav.rotate(Math.PI * route)
      cav.fillText(text, x1, y1)
      cav.fill()
      cav.rotate(-Math.PI * route)
      cav.translate(-(x1), -(y1))
    },
    drawLine (cav, x1, y1, x2, y2, x3, y3) {
      cav.beginPath()
      cav.strokeStyle = 'rgb(155, 204, 237)'
      cav.bezierCurveTo(x1, y1, x2, y2, x3, y3)
      cav.stroke()
    },
    randomNum () { // 生成随机字
      let i
      let letter = this.letter
      let text = []
      for (i = 0; i < 4; i++) {
        text.push(letter[Math.floor(Math.random() * 31)])
      }
      //console.log(text);
      let str = text.join('');
      this.$emit('getstr',str)
      return text;
    },
    randomDeg (min, max, f) { // 设置文字倾斜角度
      f = undefined ? Math.random() > 0.5 ? 1 : -1 : 1
      return f * (Math.random() * (max - min) + min)
    },
    next () {
      this.draw()
    }
  }
}
</script>

<style scoped>
  .box{display: flex;justify-content: flex-start;align-items: center;border-radius: 4px;background-color: var(--themeColor)!important;width:80px;height: 40px;margin: 0 auto;}
</style>
