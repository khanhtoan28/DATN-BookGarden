import React from "react";

return (
  <Spin spinning={false}>
    <div
      style={{
        background: "#FFFFFF",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
      className="home"
    >
      <div
        style={{ background: "#FFFFFF" }}
        className="container-banner banner-promotion"
      >
        <Carousel autoplay dots={false}>
          <div className="w-full h-96">
            <img
              src="https://static.vecteezy.com/system/resources/previews/008/558/887/non_2x/book-now-button-book-now-text-web-template-modern-web-banner-template-vector.jpg"
              alt="slide 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full h-96">
            <img
              src="https://www.fitchburgstate.edu/sites/default/files/styles/library_megasearch_sm/public/media/images/2024-06/search-banner-bg.jpg.webp?itok=8SXKf7-b"
              alt="slide 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full h-96">
            <img
              src="https://i.pinimg.com/564x/4d/60/c4/4d60c4bcacc7d285b9d66647d95a27ae.jpg"
              alt="slide 3"
              className="w-full h-full object-cover"
            />
          </div>
        </Carousel>
      </div>

      <section class="py-10 bg-white sm:py-16 lg:py-24">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Làm thế nào để mua hàng?
            </h2>
            <p class="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
              Đăng ký tài khoản miễn phí để bắt đầu trải nghiệm mua sắm.
            </p>
          </div>

          <div class="relative mt-12 lg:mt-20">
            <div class="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
              <img
                class="w-full"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
                alt=""
              />
            </div>

            <div class="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
              <div>
                <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                  <span class="text-xl font-semibold text-gray-700"> 1 </span>
                </div>
                <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                  Tạo tài khoản miễn phí
                </h3>
                <p class="mt-4 text-base text-gray-600">
                  Đăng ký tài khoản miễn phí để bắt đầu trải nghiệm mua sắm.
                </p>
              </div>

              <div>
                <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                  <span class="text-xl font-semibold text-gray-700"> 2 </span>
                </div>
                <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                  Xây dựng giỏ hàng
                </h3>
                <p class="mt-4 text-base text-gray-600">
                  Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán khi đã hoàn
                  tất lựa chọn.
                </p>
              </div>

              <div>
                <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                  <span class="text-xl font-semibold text-gray-700"> 3 </span>
                </div>
                <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                  Thanh toán và Giao hàng
                </h3>
                <p class="mt-4 text-base text-gray-600">
                  Hoàn tất thanh toán và chờ nhận sản phẩm tại địa chỉ đã cung
                  cấp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Spin>
);
export default Home;
