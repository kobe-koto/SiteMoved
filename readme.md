# SiteMoved

A simple service deployed on Cloudflare Workers to ask users to switch to your new domain.

## Configuration

The following configuration options are available:

- **`Redirect`:** (boolean) 

  >  Default: `false`

  Directly redirect to the target domain rather if set to true, 

  Show a migrate page if set to false.

  For example: 

  ```javascript
  const Redirect = true;
  // This means that when a user visits old.example.org, they will be directly redirected to new.example.org without being asked.
  ```

  

- **`DomainMap`:** (object)

  > Default: **\<no default\>**
  
  A map of old domains to new domains.
  
  For example:
  
  ```javascript
  const DomainMap = {
      "old.example.org": "new.example.org"
      // when visiting old.example.org, ask to switch to new.example.org
  };
  ```

## Deploy

1. **Log in** to your Cloudflare account.
2. Click on the **Workers & Pages** tab.
3. Click on the **Create application** button.
4. Click on the **Create Worker** button.
5. Enter a name for your worker and click on the **Deploy** button at the bottom of the page.
6. Click **Edit Code**.
7. **Copy and paste** the code in `index.js` into the code editor.
8. *(Optional)* Follow the *Configuration* section to customize your service.
9. Click on the **Save and deploy** button.
10. *(Optional)* Go back to Project and set **Custom Domain** in **Triggers**.

## License

This project is licensed under the MIT License.
