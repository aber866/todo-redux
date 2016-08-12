"use strict";

const todo = (state, action) => {
	switch (action.type) {
		case "ADD_TODO":
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case "TOGGLE_TODO":
			if (state.id !== action.id) {
				return state;
			}
			return {
				id: state.id,
				text: state.text,
				completed: !state.completed
			}
		default:
			return state;
	}
}

const todos = (state = [], action) => {
	switch (action.type) {
		case "ADD_TODO":
			return [
				...state,
				todo(undefined, action)
			];
		case "TOGGLE_TODO":
			return state.map(t => todo(t, action));
		default:
			return state;
	}
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
	switch (action.type) {
		case "SET_VISIBILITY_FILTER":
			return action.filter;
		default:
			return state;
	}
}

const { combineReducers } = Redux;
const todoApp = combineReducers({
	todos,
	visibilityFilter
});

const { createStore } = Redux;
const store = createStore(todoApp);

//React
const { Component } = React;

//Presentational component
const FilterLink = ({
	filter,
	currentFilter,
	children,
	onClick
}) => {
	if (filter === currentFilter) {
		return <span>{children}</span>
	}
	return (
		<a href="#"
			onClick={(e) => {
				e.preventDefault();
				onClick(filter);
			}}
		>
			{children}
		</a>
	);
};

//Footer component with filters. visibilityFilter and onFilterClick are function arguments as a props
const Footer = ({
	visibilityFilter,
	onFilterClick
}) => (
	<p>
		Show:
		{" "}
		<FilterLink
			filter="SHOW_ALL"
			currentFilter={visibilityFilter}
			onClick={onFilterClick}
		>All
		</FilterLink>
		{" "}
		<FilterLink
			filter="SHOW_ACTIVE"
			currentFilter={visibilityFilter}
			onClick={onFilterClick}
		>Active
		</FilterLink>
		{" "}
		<FilterLink
			filter="SHOW_COMPLETED"
			currentFilter={visibilityFilter}
			onClick={onFilterClick}
		>Completed
		</FilterLink>
	</p>
);


//Presentational component without any behaviour. Onclick is defined outside.
const Todo = ({
	onClick,
	completed,
	text
}) => (
	<li
		onClick={onClick}
		style={{
			textDecoration:
				completed ? "line-through" : "none"
		}}
	>
		{text}
	</li>
);

const TodoList = ({
	todos,
	onTodoClick
}) => (
	<ul>
		{todos.map(todo =>
			<Todo
				key={todo.id}
				{...todo}
				onClick={() => onTodoClick(todo.id)}
			/>
		)}
	</ul>
);

//Presentational component with button and input inside the return. store.dispatch encapsulated as arguments between brackets
const AddTodo = ({
	onAddClick
}) => {
	let input;
	return (
		<div>
			<input ref={(node) => {
				input = node;
			}} />
			<button onClick={() => {
				onAddClick(input.value);
				input.value = "";
			}}>
			Add Todo
			</button>
		</div>
	);
};

const getVisibleTodos = (
	todos,
	filter
) => {
	switch (filter) {
		case "SHOW_ALL":
			return todos;
		case "SHOW_COMPLETED":
			return todos.filter(
				(t) => t.completed
			);
		case "SHOW_ACTIVE":
			return todos.filter(
				(t) => !t.completed
			);
	}
}

let nextTodoId = 0;

//Reducer dispatchs are passed as props through the above components.
const TodoApp = ({
	todos,
	visibilityFilter
}) => (
	<div>
		<AddTodo 
			onAddClick={(text) =>
				store.dispatch({
					type: "ADD_TODO",
					id: nextTodoId++,
					text
				})
			}
		/>
		<TodoList
			todos={
				getVisibleTodos(
					todos,
					visibilityFilter
				)
			} 
			onTodoClick={(id) => 
				store.dispatch({
					type: "TOGGLE_TODO",
					id 
				})
			}
		/>
		<Footer
			visibilityFilter={visibilityFilter}
			onFilterClick={(filter) =>
				store.dispatch({
					type: "SET_VISIBILITY_FILTER",
					filter
				})
			}
		/>
	</div>
);

//We render the TodoApp component every time the store changes. We receive the todos and the visibilityFilter values
const render = () => {
	ReactDOM.render(
		<TodoApp
			{...store.getState()} 
		/>,
		document.getElementById("root")
	);
};

store.subscribe(render);
render();





