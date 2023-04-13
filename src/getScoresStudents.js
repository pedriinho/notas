function mean_function(students){
    students.id.forEach((data, index) => {
        if(students.reav[index] > students.ab1[index] && students.ab1[index] < students.ab2[index]) {
            students.mean[index] = ((students.reav[index] + students.ab2[index])/2);
  
        }
        else if(students.reav[index] > students.ab2[index] && students.ab2[index] < students.ab1[index]){
            students.mean[index] = ((students.ab1[index] + students.reav[index])/2);
        }
        else{
            students.mean[index] = ((students.ab1[index] + students.ab2[index])/2);
        }
  
  
        if(students.mean[index] >= 7 || ((6 * students.mean[index] + 4 * students.final[index])/10 >= 5.5)){
            students.situation[index] = 'APROVADO';
        }
  
    });
  }
  
  async function getUserScores(url, headers, weight, students, ab, list, reav){
    const response = await fetch(url, {
        method: "GET",
        headers: headers
    })
  
    const data_response = await response.json().then();
  
    data_response.forEach(data_student_list => {
        var score = 0;
  
        data_student_list.correctProblems.forEach(correct_problem => {
            if(list){
                score += correct_problem.score;
            }
            else{
                score += correct_problem.partialScore;
            }
        })
  
        students.id.forEach((user_id, index) => {
            if(user_id === data_student_list.userId){
                if(ab === 1 && list && !reav){
                    students.ab1[index] += score / weight[0]*3;
                }
                else if(ab === 1 && !list && !reav){
                    students.ab1[index] += (score/2) / weight[0]*0.7;
                }
                else if(ab === 2 && list && !reav){
                    students.ab2[index] += score / weight[1]*3;
                }
                else if(ab === 2 && !list && !reav){
                    students.ab2[index] += (score/2) / weight[1]*0.7;
                }
                else if(ab === 1 && !list && reav){
                    students.reav[index] += score;
                }
                else if(ab === 2 && !list && reav){
                    students.final[index] += score;
                }
                
            }
        });
        
    });
    mean_function(students);
  }
  
  async function urls_lists(headers, students){
    var urls = [];
    var weight = [59, 66];
    for(var i = 8312; i < 8320; i++){
        urls.push('https://www.thehuxley.com/api/v1/quizzes/' + i + '/scores');
        await getUserScores(urls[i-8312], headers, weight, students, parseInt((i-8312)/4)+1, true ,false);
    }
  }
  
  async function urls_tests(headers, students){
    var urls = [];
    var weight = [1, 1];
    for(var i = 8320; i < 8324; i++){
        urls.push('https://www.thehuxley.com/api/v1/quizzes/' + i + '/scores');
        await getUserScores(urls[i-8320], headers, weight, students, parseInt((i-8320)/2)+1, false ,false);
    }
  }
  
  async function getStudentData(headers, students){
    const response = await fetch('https://www.thehuxley.com/api/v1/quizzes/8324/users?max=100&offset=0', {
        method: "GET",
        headers: headers
    })
    const data_response = await response.json().then();
  
    for(var i = 0; i < data_response.length; i++){
        students.names.push(data_response[i].name);
        students.id.push(data_response[i].id);
        students.ab1.push(0);
        students.ab2.push(0);
        students.reav.push(0);
        students.final.push(0);
        students.mean.push(0);
        students.situation.push('EM ANÁLISE');
    }
  
    await urls_lists(headers, students);
    await urls_tests(headers, students);
    
  }
  
  async function criar_tabela(students){
    for(let i = 0; i < 10000; i++){
        break;
    }
    return await students;
  }
  
  async function getSubmissions(token, students){
    var headers = {"Authorization": "Bearer " + token};
  
    await getStudentData(headers, students);
    return criar_tabela(students);
  }
  
  async function get_token(username, password){
    var headers = {
    "Content-type": "application/json"
    }
    var data = {
    "username": username,
    "password": password,
    }
  
    const response = await fetch("https://thehuxley.com/api/login", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    const token_json = await response.json().then(data);
  
    
  
    return await token_json.access_token;
  }
  
  export async function montar_notas() {
    var students = {
      "names": [],
      "id": [],
      "ab1": [],
      "ab2": [],
      "reav": [],
      "final": [],
      "mean": [],
      "situation": [],
    };
  
    const token = await get_token(process.env.REACT_APP_USER, process.env.REACT_APP_PASS);
    return await getSubmissions(token, students);
  }