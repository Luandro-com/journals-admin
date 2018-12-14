import ReactQuill from 'react-quill'; // ES6

export default ({ onEditorStateChange, input }) => <ReactQuill value={input.value}
  onChange={e => onEditorStateChange(e)}
/>