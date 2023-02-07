# SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
#
# SPDX-License-Identifier: AGPL-3.0-only

# Zextras Login Page
# This package contains the assets for the browser login page

targets=(
  "centos"
  "ubuntu"
)
pkgname="carbonio-login-ui"
pkgver="0.9.3"
pkgrel="2"
pkgdesc="Zextras login page assets"
pkgdesclong=(
  "Zextras login page assets"
)
maintainer="Zextras <packages@zextras.com>"
arch="amd64"
license=("PROPRIETARY")
section="admin"
priority="optional"
url="https://www.zextras.com/"
depends=(
  "carbonio-nginx"
)

build() {
}

preinst() {
}

package() {
  cd "${srcdir}"
  mkdir -p "${pkgdir}/opt/zextras/web/login/"
  cp -a  ../build/* "${pkgdir}/opt/zextras/web/login"
  chown root:root -R "${pkgdir}/opt/zextras/web/login"
  chmod 755 -R "${pkgdir}/opt/zextras/web/login"
}

postinst() {
}

prerm() {
}

postrm() {
}
