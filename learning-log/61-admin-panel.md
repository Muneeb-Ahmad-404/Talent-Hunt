Open app/admin/layout.tsx and trace every line of code that executes before the admin page renders. Write down each decision point and what happens if it returns false or an error. This mental model applies to every protected page in the app.

It first retrieves the access_token from cookies, if its not present redirected to login and otherwise fetch user profile, if the call is successfull retrieve the user data and check for whether the user has an admin role if  not then redirect else continue with ui.

Compare the admin panel's Server Action pattern with the recruiter panel's Server Action from Chapter 38. List three things they have in common and one structural difference.

Both are server side components, read cookie server side and revalidate path.
Both require or enforce different roles.