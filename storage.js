
const storage = {
    salvar(id,valor){
        localStorage.setItem(id,JSON.stringify(valor));        
    },
    get: function(id){
        return JSON.parse(localStorage.getItem(id));

    }
}