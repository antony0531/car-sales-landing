# Netlify Forms Fix Documentation

## Issue Resolved
Forms were not submitting to Netlify despite being detected in the dashboard.

## Root Cause
The hidden `form-name` field was conflicting with Netlify's form processing. 

## Solution
Remove the hidden input field:
```html
<!-- DON'T DO THIS -->
<input type="hidden" name="form-name" value="form-name-here">
```

## Working Form Structure
```html
<form method="POST" data-netlify="true" name="your-form-name" action="/thank-you.html">
    <!-- Your form fields here -->
    <!-- NO hidden form-name field needed -->
</form>
```

## Key Requirements
1. `method="POST"` - Required for form submission
2. `data-netlify="true"` - Tells Netlify to process the form
3. `name="unique-name"` - Unique identifier for the form
4. `action="/thank-you.html"` - Optional redirect after submission
5. NO hidden form-name field - Let Netlify handle this automatically

## Testing
The minimal form at `/minimal-test.html` confirmed this solution works.