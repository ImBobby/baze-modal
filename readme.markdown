# Baze Modal

> a jQuery plugin to create simple, accessible and mobile friendly modal dialog.

## Getting Started

Install via bower 

```
bower install baze-modal --save
```

## Usage

Include Baze-Modal's CSS and Javascript files along with jQuery.

```HTML
<link rel="stylesheet" href="path/to/baze.modal.css">
.
<script src="path/to/jquery.js"></script>
<script src="path/to/baze.modal.js"></script>
```

Set up the markup

```HTML
<button data-target="#[MODAL_ID]">...</button>

<div class="bzm-content" id="[MODAL_ID]" data-title="[MODAL_TITLE]">
    <!-- MODAL CONTENT -->
</div>
```

then, init baze-modal

```Javascript
$('button').bazeModal();
```

### Example

```HTML
<button id="modalTrigger" data-target="#myModal">Open Modal</button>

<div class="bzm-content" id="myModal" data-title="Hello Modal">
    <p>You look awesome today!</p>
</div>
```

``` Javascript 
$('#modalTrigger').bazeModal();
```

## Options

| Option  | Type  | Default  | Description  |
|---|---|---|---|
| onOpen  | function  | null  | callback after dialog is opened  |
| onClose  | function  | null  | callback after dialog is closed  |


## Destroy Baze Modal

Trigger the `bazemodal.destroy` event to destroy Baze Modal

```Javascript
$('#modalTrigger').trigger('bazemodal.destroy');
```


## Browser support

Baze Modal support all evergreen browsers and IE8+ with graceful degradation.

## Todo

- [X] IE8 Support
- [ ] Image Gallery Support