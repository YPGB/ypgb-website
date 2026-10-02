One-line: centred modal on a blue scrim — confirmations, short forms, gallery captions.

```jsx
<Dialog title="Kirim pesan?" onClose={close}
  footer={<><Button variant="secondary" onClick={close}>Batal</Button><Button>Kirim</Button></>}>
  Pesan Anda akan diteruskan ke sekretariat Yayasan.
</Dialog>
```

Notes
- 16px radius (larger than Card's 10px), `--shadow-lg`, rises 10px on open.
