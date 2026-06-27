const WelcomeCard = ({ user }) => {
  const currentHour = new Date().getHours();

  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <section className="welcome-card">
      <h1>
        {greeting}, {user?.full_name}
      </h1>

      <p>
        Welcome back to CareerLens AI. Continue building your career journey.
      </p>
    </section>
  );
};

export default WelcomeCard;