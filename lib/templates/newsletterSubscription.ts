export const newsletterSubscriptionTemplate = `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    <head>
        <title></title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

        <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
            -webkit-font-smoothing: antialiased;
            box-sizing: border-box;
            font-family: Raleway, 'Segoe UI', 'Noto Sans',Helvetica,Arial,sans-serif !important;
        }
        body {
            margin: 0;
            padding: 0;
            min-width: 100%;
            font-family: Raleway, 'Segoe UI', 'Noto Sans',Helvetica,Arial,sans-serif !important;
            -webkit-font-smoothing: antialiased;
            mso-line-height-rule: exactly;
        }
        </style>
    </head>
    <body>
        <h1>Thank you for subscribing to the newsletter {{email}}</h1>
        <p>We will send you the latest news and updates</p>
    </body>
</html>
`;
