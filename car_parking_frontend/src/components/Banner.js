export default function Banner({ message, type }) {
  return (
    <div className={`alert ${type === 'error' ? 'alert-danger' : 'alert-success'}`} role="alert">
      {message}
    </div>
  );
}
