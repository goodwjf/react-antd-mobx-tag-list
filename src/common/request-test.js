function async (data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, 1000)
  })
}

export let getTaskList = () => {
  let data = []
  for (var i = 0; i < 100; i++) {
    data.push('任务' + i)
  }
  return async({
    result: 0,
    tasks: data
  })
}
