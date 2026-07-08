function Login() {

    const login = () => {
        window.location.href =
            "http://127.0.0.1:8000/api/auth/github/login/";
    };

    return (
        <div>
            <button onClick={login}>
                Login with GitHub
            </button>
        </div>
    );
}