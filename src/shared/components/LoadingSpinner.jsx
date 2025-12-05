export default function LoadingSpinner({ size = 4, color = "white" }) {
     return (
          <div
               className={`h-${size} w-${size} border-2 border-${color} border-t-transparent rounded-full animate-spin`}
          ></div>
     );
}
