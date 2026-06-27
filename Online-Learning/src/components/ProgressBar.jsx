export default function ProgressBar({ progress }) {
  return (
    <div className='progress'>
      <div
        className='progress-bar bg-success progress-bar-striped progress-bar-animated'
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
}
