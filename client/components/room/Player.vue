<template lang='pug'>
.player
  .playerImage
    .box(v-if='$props.isOpen')
      .boxImage(
        v-if='selected && !selectedQuestion && !selectedInfinity'
        v-bind:point='$props.point'
        v-bind:class='{"icon-box": !isHalf, "icon-halfbox": isHalf}'
      )
      .infinity
        i.material-icons(
          v-if='selectedInfinity'
        )
          | ☕
      .question(
        v-if='selectedQuestion'
      )
        | ?
    .thinkingBox(v-else)
      .selected
        .fukidashi(:selected='selected')
          .icon-fukidashi
        .text
          .okText(v-if='selected')
            | ok!
          .thinkingText(v-else)
            | …
    .human
      .icon-stand(v-if='!selected')
      .icon-handup(v-if='selected')
  .playerInformation
    .name(:myself='$props.isMyself')
      | {{name}}
    .point
      v-chip.primary.primary--text(outline) {{pointLabel}}
      span.status(v-if='isMin').min
        i.material-icons vertical_align_bottom
      span.status(v-if='isMax').max
        i.material-icons vertical_align_top
</template>

<script>
export default {
  name: 'Player',
  props: ['id', 'name', 'point', 'isMyself', 'isOpen', 'isConsensus', 'max', 'min'],
  computed: {
    isHalf ()  {
      return this.$props.point === 0.5;
    },
    selected () {
      return this.$props.point !== null;
    },
    selectedQuestion() {
      return this.$props.point === -1;
    },
    selectedInfinity () {
      return this.$props.point === 999;
    },
    pointLabel() {
      if (!this.$props.isMyself && !this.$props.isOpen) return '...'
      if (this.selectedQuestion) return '?';
      if (this.selectedInfinity) return '☕';
      if (this.$props.point === 0 || this.$props.point) return `${this.$props.point} pt`; 
      return '...';
    },
    viewStatus() {
      return this.$props.isOpen && !this.$props.isConsensus;
    },
    isMax() {
      return this.viewStatus && this.$props.point === this.$props.max;
    },
    isMin() {
      return this.viewStatus && this.$props.point === this.$props.min;
    }
  }
}
</script>

<style scoped>
.player {
  width: 200px;
  min-width: 200px;
  height: 350px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playerImage {
  width: 100%;
  height: 260px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.playerInformation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.name[myself] {
  font-weight: bold;
}

.point {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.point .status {
  margin-left: -7px;
  margin-bottom: -7px;
}

.point .status i {
  font-size: 2rem;
}

.point .status.max i {
  color: #d21919 !important
}

.point .status.min i {
  color: #1976d2 !important
}

.human {
  font-size: 65px;
}

.thinkingBox {
  display: flex;
  position: relative;
}

.thinkingBox .text {
  position: absolute;
  font-size: 20px;
  top: 0px;
  z-index: 100;
  width: 100%;
  text-align: center;
  margin-top: 15px;
}

.fukidashi {
  font-size: 75px;
  color: hsla(0, 0%, 93%, 1);
  margin-bottom: 8px;
}
.fukidashi[selected] {
  color: #fff1b7;
}

.infinity i {
  font-size: 180px;
}
.question {
  font-size: 120px;
}
.boxImage {
  margin-bottom: -3px;
  margin-left: 8px;
}
.icon-halfbox {
  font-size: 20px;
  margin-bottom: -2px;
}
.icon-box[point="0"] {
  display: none;
}
.icon-box[point="1"] {
  font-size: 40px;
}
.icon-box[point="2"] {
  font-size: 50px;
}
.icon-box[point="3"] {
  font-size: 58px;
}
.icon-box[point="5"] {
  font-size: 68px;
}
.icon-box[point="8"] {
  font-size: 80px;
}
.icon-box[point="13"] {
  font-size: 94px;
}
.icon-box[point="21"] {
  font-size: 108px;
}
.icon-box[point="34"] {
  font-size: 137px;
}
.icon-box[point="55"] {
  font-size: 185px;
}
.icon-box[point="89"] {
  font-size: 234px;
}
.icon-box[point="999"] {
  font-size: var(--baseBoxSize);
}
.icon-box[point="-1"] {
  font-size: var(--baseBoxSize);
}
</style>
