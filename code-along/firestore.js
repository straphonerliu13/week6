document.addEventListener('DOMContentLoaded', async function(event) {
  // Step 1: Make the world's tiniest to-do app

    // First thing we do is intercept that form select
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      console.log('Form was submitted')

      let todoText = document.querySelector('#todo').value
      console.log(todoText)

      if (todoText.length > 0) {

        let docRef = await db.collection('todos').add({
          text: todoText

        })
      
        let todoID = docRef.id // => the newly created document's ID

      document.querySelector('.todos').insertAdjacentHTML('beforeend', `
        <div class="todo-${todoID} py-4 text-xl border-b-2 border-purple-500 w-full">
          <a href="#" class = "done p-2 text-sm bg-green-500 text-white">Done!</a>
          ${todoText}
        </div>`)

      
      // Need to paste in the below section to this section as part of Step 4
      
       document.querySelector(`.todo-${todoID} .done`).addEventListener('click', async function(event) {
          console.log(`todo with ID ${todoID} clicked!`)
          event.preventDefault()
          document.querySelector(`.todo-${todoID}`).classList.add('opacity-20')
          await db.collection('todos').doc(todoID).delete()
        })

        document.querySelector('#todo').value = ''

      }
    })
    // Now need to think about where the server comes in play - move on to Step 2
  
  // Step 2: Read existing to-dos from Firestore

    // Create database and documents within Cloud Firestore
    // Start collection - name as 'todos'
    // Add documents, auto generate IDs, set first field to "text", then "string", then enter your "todos" (e.g., "walk the dog", "eat tacos", "buy milk")
    // Putting all todos in one document works but is not as convenient to code around
    // Now, with 3 todos inside the collection, need to connect code in VSC to FireStore
    
    // First, set up application to be able to talk to Firestore 
      // Go to settings icon next to Project Overview and click "Project Settings"
      // Scroll to "Your apps" and click on third icon for "web"
      // Set nickname as anything you want - e.g., week6
      // Click register app
      // Now you see code to copy and paste into VSC - add to html page (end of body but before the "firestore.js" script tag)
      // If you ever lose that piece of config that we had to copy and paste, go back to "Project Settings" and your "app" will be at the bottom to add the Firebase SDK to your web app again
      // Last thing to do: add individual SDKs for firebase products you want to use (link provided in copied and pasted code)
        // We need to add the firestore product to our app
        // Choose the option ending in "...from the CDN" and copy link next to "Cloud Firestore" and paste this under the link to the product libraries
      
    // At this point, when we go back to the web page, there is no change - we've only added the SDK to the software
    // Open Firestore.html under "reference" repository in week 6 to get more instruction on Firestore

    // Now: Step 2 actions
      // Get the 3 todos out of firestore and into our app - see "Retrieve all docs in a collection" in reference
      // Create a variable for database - this is how we talk to database

      let db = firebase.firestore()

      let querySnapshot = await db.collection('todos').get()
      querySnapshot.size // => 3
      console.log(querySnapshot.size)

  // Step 3: Add code to Step 1 to add todo to Firestore

      let todos = querySnapshot.docs

      for (let i=0; i<todos.length; i++){
        let todoID = todos[i].id 
        let todoData = todos[i].data()
        let todoText = todoData.text 

        console.log(todoText)

        document.querySelector('.todos').insertAdjacentHTML('beforeend', `
        <div class="todo-${todoID} py-4 text-xl border-b-2 border-purple-500 w-full">
          <a href="#" class = "done p-2 text-sm bg-green-500 text-white">Done!</a>
          ${todoText}
        </div>`)

  
  // Step 4: Add code to allow completing todos
    // See above "Step 4" indicators for additional steps included as part of this step

        document.querySelector(`.todo-${todoID} .done`).addEventListener('click', async function(event) {
          console.log(`todo with ID ${todoID} clicked!`)
          event.preventDefault()
          document.querySelector(`.todo-${todoID}`).classList.add('opacity-20')
          await db.collection('todos').doc(todoID).delete()
        })

      }


})