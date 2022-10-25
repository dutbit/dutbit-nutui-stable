<template>
  <div class="bit-container">
    <nut-cell>正在开发.</nut-cell>
  </div>
</template>

<script>
import { Notify, Dialog } from '@nutui/nutui'
import axios from 'axios'
import { ref, reactive } from 'vue'
export default {
  name: 'Enroll',
  setup() {
    let signupForm = reactive({
      name: '',
      stuId: '',
      sex: '',
      faculty: '',
      tel: '',
      firstChoice: '',
      secondChoice: '',
      thirdChoice: '',
      allowAdjust: true,
      info: '',
    })
    let noticeText = ref('')
    let currentTurn = reactive({ id: null, turnName: null, activated: null }) //当前报名批次的id和名称
    let faculties = reactive([
      '电子信息与电气工程学部',
      '建设工程学部',
      '人文与社会科学学部',
      '运载工程与力学学部',
      '材料科学与工程学院',
      '光电工程与仪器科学学院',
      '化工学院',
      '环境学院',
      '机械工程学院',
      '建筑与艺术学院',
      '经济管理学院',
      '能源与动力学院',
      '生物工程学院',
      '数学科学学院',
      '外国语学院',
      '物理学院',
      '张大煜学院',
      '大连理工大学白俄罗斯国立大学联合学院',
    ])
    let depts = reactive({ data: [] })
    axios
      .get('/enroll/getTurns')
      .then((response) => {
        const turns = response.data.turns.filter((p) => {
          if (p.activated) {
            return p
          }
        })
        if (turns.length == 0) {
          noticeText.value = '很遗憾，现在并不在报名时间内'
          Notify.danger('不在报名时间内')
        } else {
          let turn = turns[0]
          currentTurn.id = turn.id
          currentTurn.activated = turn.activated
          currentTurn.turnName = turn.turnName
          noticeText.value =
            '欢迎报名大连理工大学融媒体中心! 当前报名批次:' +
            currentTurn.turnName
        }
      })
      .catch(() => {
        Notify.danger('无法获取报名批次，请联系管理员')
      })
    axios
      .get('/enroll/getDepts')
      .then((response) => {
        depts.data = response.data.depts.map((p) => {
          return p.deptName
        })
      })
      .catch(() => {
        Notify.danger('无法获取部门名单，请联系管理员')
      })

    let showFacultyPicker = ref(false)
    let showFirstChoicePicker = ref(false)
    let showSecondChoicePicker = ref(false)
    let showThirdChoicePicker = ref(false)

    const stuIdPattern = /^\d{8,11}$/
    // 注意！正则表达式中不要加入空格！！
    const telPattern =
      /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

    const onSubmit = () => {
      if (!currentTurn.activated) {
        Notify.danger('不在报名时间内')
        return
      }
      if (!signupForm.firstChoice) {
        Notify.danger('请选择至少一个志愿！')
        return
      }
      console.log(signupForm)
      const signupData = {
        ...signupForm,
        turnId: currentTurn.id,
      }
      const verifyInfo = {
        info: {
          name: signupForm.name,
          stuId: signupForm.stuId,
          turnId: currentTurn.id
        },
      }
      const submitForm = () => {
        axios
          .post('/enroll/submit', signupData)
          .then((response) => {
            if (response.data.success) {
              Notify.success('已提交报名表！')
            }
          })
          .catch(() => {
            Notify.danger('无法提交报名表，请联系管理员')
          })
      }
      axios.post('/enroll/verifyUnique', verifyInfo).then((response) => {
        console.log(response.data)
        if (!response.data.unique) {
          const time = response.data.time
          Dialog.confirm({
            title: '重要提示',
            message: `在${time},你已经提交了一份姓名或学号相同的报名表，再次提交将覆盖原有的报名表，是否继续？`,
          })
            .then(() => {
              // on confirm
              submitForm()
            })
            .catch(() => {
              Notify.primary('已放弃提交~')
            })
        } else {
          submitForm()
        }
      })
    }
    const onConfirmFaculty = (value) => {
      signupForm.faculty = value
      showFacultyPicker.value = false
    }
    const firstChoiceHandler = () => {
      showFirstChoicePicker.value = true
    }
    const secondChoiceHandler = () => {
      if (signupForm.firstChoice) {
        showSecondChoicePicker.value = true
      } else {
        Notify.danger('请先选择第一志愿')
      }
    }
    const thirdChoiceHandler = () => {
      if (signupForm.firstChoice && signupForm.secondChoice) {
        showThirdChoicePicker.value = true
      } else {
        Notify.danger('请先选择第一或第二志愿')
      }
    }
    const onConfirmFirstChoice = (value) => {
      signupForm.firstChoice = value
      showFirstChoicePicker.value = false
    }
    const onConfirmSecondChoice = (value) => {
      signupForm.secondChoice = value
      showSecondChoicePicker.value = false
    }
    const onConfirmThirdChoice = (value) => {
      signupForm.thirdChoice = value
      showThirdChoicePicker.value = false
    }
    return {
      noticeText,
      signupForm,
      faculties,
      depts,
      showFacultyPicker,
      showFirstChoicePicker,
      showSecondChoicePicker,
      showThirdChoicePicker,
      stuIdPattern,
      telPattern,
      onSubmit,
      onConfirmFaculty,
      onConfirmFirstChoice,
      onConfirmSecondChoice,
      onConfirmThirdChoice,
      firstChoiceHandler,
      secondChoiceHandler,
      thirdChoiceHandler,
    }
  }
}
</script>

<style scoped>

</style>
