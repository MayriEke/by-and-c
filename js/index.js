//   animation for the changing word in the header
function startRotatingText() {
    const words = ['Men', 'Women', 'Kids', 'Yourself'];
    let index = 0;
    const animate = document.getElementById('animate');
    function rotate() {
        animate.textContent = words[index];
        index = (index + 1) % words.length; // loop back
    };
    rotate(); // initialize immediately
    setInterval(rotate, 1000); // change every 2 seconds
};
startRotatingText();

// SIGNUP FUNCTION
function custSignup(event) {
    event.preventDefault();
    
    const getName = document.getElementById("Name").value.trim();
    const getEmail = document.getElementById("Email").value.trim();
    const getPassword = document.getElementById("Password").value.trim();
    const getConfirm = document.getElementById("ConfirmPassword").value.trim();
    // validation
    if (!getName || !getEmail || !getPassword || !getConfirm) {
        Swal.fire({
             icon: 'info',
             text: 'All fields are required!',
             confirmButtonColor: "#BD3A3A"
            });
        return;
    }
    if (getConfirm !== getPassword) {
        Swal.fire({
            icon: 'warning',
            text: "Passwords don't match",
            confirmButtonColor: "#BD3A3A"
        });
        return;
    }

    const signData = {
        name: getName,
        email: getEmail,
        password: getPassword,
        confirmPassword: getConfirm
    };
    const signMethod = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signData)
    };
    const url = "http://localhost:3001/byc/api/users";
    fetch(url, signMethod)
        .then(res => res.json())
        .then(result => {   
            console.log(result);
            if (result._id) {
                Swal.fire({
                    icon: 'success',
                    text: 'Registration successful!',
                    confirmButtonColor: "#BD3A3A"
                });
                setTimeout(() => {
                    location.href = "login.html";
                }, 2000);
            } else {
                Swal.fire({
                    icon: 'info',
                    text: result.message || 'Registration failed',
                    confirmButtonColor: "#BD3A3A"
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                text: 'Something went wrong! Try again later',
                confirmButtonColor: "#BD3A3A"
            });
        });
}

// LOGIN FUNCTION
function custLog(event) {
    event.preventDefault();
    
    const getEmail = document.getElementById("email").value.trim();
    const getPassword = document.getElementById("password").value.trim();
        // validation
    if (!getEmail || !getPassword) {
        Swal.fire({
             icon: 'info',
             text: 'All fields are required!',
             confirmButtonColor: "#BD3A3A"
            });
        return;
    }

    const logData = {
        email: getEmail,
        password: getPassword,
    };
    const logMethod = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
    };
    const url = "http://localhost:3001/byc/api/login";
    fetch(url, logMethod)
        .then(res => res.json())
        .then(result => {   
            console.log(result);
            if (result.token) {
                localStorage.setItem('token', result.token);
                Swal.fire({
                    icon: 'success',
                    text: 'Login successful!',
                    confirmButtonColor: "#BD3A3A"
                });
                setTimeout(() => {
                    location.href = "index.html";
                }, 2000);
            } else {
                Swal.fire({
                    icon: 'info',
                    text: result.message || 'Registration failed',
                    confirmButtonColor: "#BD3A3A"
                });
            }
        })
        .catch(err => {
            console.error("Error:", err);
            Swal.fire({
                icon: 'error',
                text: 'Something went wrong! Try again later',
                confirmButtonColor: "#BD3A3A"
            });
        });
}