import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-r from-green-400 to-green-600 py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Get in Touch
          </h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-1 gap-8 mx-auto">
            <div className="bg-green-100 p-6 rounded-lg shadow-md border-2 border-green-200 text-center">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                Address
              </h3>
              <p className="mt-2 text-gray-600 text-sm md:text-base">
                San Roque St. Cor Kagitingan Ext
                <br />
                Tondo Manila, Manila, Philippines
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl md:text-2xl">Phone</h3>
                <div className="text-base-content/70">
                  <p className="mb-2">
                    Elmer Burca
                    <br />
                    <span className="">+63 916 698 6880</span>
                  </p>
                </div>
                <h3 className="card-title text-xl md:text-2xl">Viber</h3>
                <div className="text-base-content/70">
                  <p>
                    Apply Joy Ruben
                    <br />
                    <span className="">+63 945 463 331</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl md:text-2xl">Email</h3>
                <div className="text-base-content/70">
                  <p className="mb-2">
                    <span className="">brgy20zone2dist1manila@gmail.com</span>
                  </p>
                </div>
                <h3 className="card-title text-xl md:text-2xl">Facebook</h3>
                <div className="text-base-content/70">
                  <Link
                      href="https://www.facebook.com/BarangatBenteSipagatGaling"
                      className="btn btn-ghost text-blue-600 italic"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Barangay Bente Sipagat at Galing
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
