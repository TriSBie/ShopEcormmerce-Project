let todos = []

exports.getAll = (req, res) => {
    res.send(todos)
}

exports.create = (req, res) => {
    const todo = req.body
    todos.push(todo)
    res.send(todo)
}

exports.getById = (req, res) => {
    const id = parseInt(req.params.id)
    const todo = todos.find((t) => t.id === id)
    if (!todo) {
        res.status(404).send()
    } else {
        res.send(todo)
    }
}

exports.update = (req, res) => {
    const id = parseInt(req.params.id)
    const todo = todos.find((t) => t.id === id)
    if (!todo) {
        res.status(404).send()
    } else {
        const newTodo = req.body
        todos = todos.map((t) => (t.id === id ? newTodo : t))
        res.send(newTodo)
    }
}

exports.delete = (req, res) => {
    const id = parseInt(req.params.id)
    todos = todos.filter((t) => t.id !== id)
    res.status(204).send()
}